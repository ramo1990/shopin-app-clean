from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
import uuid
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication

# Panier
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Renvoie uniquement les items du panier de l’utilisateur connecté
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(user=self.request.user)
        else:
            # Pour les utilisateurs non authentifiés, filtre par anonymous_user_id
            anonymous_user_id = self.request.query_params.get('anonymous_user_id', None)
            if anonymous_user_id:
                return CartItem.objects.filter(anonymous_user_id=anonymous_user_id)
            return CartItem.objects.none()

    def create(self, request, *args, **kwargs):
        # Si l'utilisateur est connecté, on lui associe le produit
        user = request.user if request.user.is_authenticated else None
        data = request.data.copy()

        anonymous_user_id = (
            data.get('anonymous_user_id')
            or request.query_params.get('anonymous_user_id')
            or str(uuid.uuid4()))
        
        if user:
            data['user'] = user.id
            data['anonymous_user_id'] = None
        else:
            data['anonymous_user_id'] = anonymous_user_id

        # Récupérer les données du produit et de la quantité
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        print("Ajout au panier - utilisateur :", user)
        print("Produit :", product)
        print("Quantité :", quantity)

        # Vérifie si un CartItem existe déjà pour ce produit et cet utilisateur (ou ID anonyme)
        existing_item = CartItem.objects.filter(
            user=user, 
            anonymous_user_id=None if user else anonymous_user_id, 
            product=product).first()
        
        if existing_item:
            # Si oui, mets à jour la quantité
            existing_item.quantity += quantity
            existing_item.save()
            return Response({"message": "Quantité mise à jour dans le panier"}, status=status.HTTP_200_OK)
        
        # Creation
        instance= self.perform_create(serializer)
        serializer = self.get_serializer(instance)
        headers = self.get_success_headers(serializer.data)

        response = Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        # else:
        #     # Sinon, crée l'élément normalement
        #     cart_item = serializer.save(user=user, anonymous_user_id=anonymous_user_id)
        #     response = Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

        # Si l'utilisateur est anonyme, on sauvegarde son anonymous_user_id dans les cookies
        if not user:
            response.set_cookie('anonymous_user_id', anonymous_user_id, max_age=3600*24*7)  # 7 jours par ex
            # response.data = {"message": "Article ajouté au panier"}
        return response

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        anon_id = (
            self.request.data.get('anonymous_user_id') or
            self.request.query_params.get('anonymous_user_id'))

        serializer.save(user=user, anonymous_user_id=None if user else anon_id)
    
    def get_object(self):
        obj = super().get_object()
        user = self.request.user if self.request.user.is_authenticated else None
        anon_id = (
            self.request.data.get('anonymous_user_id') or
            self.request.query_params.get('anonymous_user_id')
        )

        if obj.user != user or (user is None and str(obj.anonymous_user_id) != str(anon_id)):
            raise PermissionDenied("Vous n'avez pas le droit d'accéder à cet objet.")

        return obj
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # fusion de panier user non connecté et connecté
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], authentication_classes=[JWTAuthentication])
    def merge(self, request):
        anon_id = request.data.get('anonymous_user_id')

        if not anon_id:
            return Response({'error': 'anonymous_user_id requis'}, status=status.HTTP_400_BAD_REQUEST)

        # Récupère les articles anonymes
        anonymous_items = CartItem.objects.filter(anonymous_user_id=anon_id)

        print("➡️ Fusion du panier pour l'utilisateur :", request.user)
        print("➡️ anonymous_user_id utilisé :", anon_id)
        
        for item in anonymous_items:
            # Vérifie si un item identique existe déjà pour cet utilisateur
            existing = CartItem.objects.filter(user=request.user, product=item.product).first()
            if existing:
                # S’il existe, on ajoute la quantité
                existing.quantity += item.quantity
                existing.save()
                item.delete()
            else:
                # Sinon, on attribue l'item anonyme à l'utilisateur
                item.user = request.user
                item.anonymous_user_id = None
                item.save()

        items = CartItem.objects.filter(user=request.user)
        serialized_items = CartItemSerializer(items, many=True)
        return Response(serialized_items.data, status=status.HTTP_200_OK)