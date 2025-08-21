from rest_framework import viewsets
from .models import *
from .serializers import *
# from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
import uuid


# Panier
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
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

    def perform_create(self, serializer):
        # Si l'utilisateur est connecté, on lui associe le produit
        user = self.request.user if self.request.user.is_authenticated else None

        anonymous_user_id = (
            self.request.data.get('anonymous_user_id')
            or self.request.query_params.get('anonymous_user_id')
            or str(uuid.uuid4())
            )

        if user:
            anonymous_user_id = None
        elif not anonymous_user_id:
            anonymous_user_id = str(uuid.uuid4())

        # Récupérer les données du produit et de la quantité
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        # Vérifie si un CartItem existe déjà pour ce produit et cet utilisateur (ou ID anonyme)
        existing_item = CartItem.objects.filter(user=user, anonymous_user_id=anonymous_user_id, product=product).first()
        
        if existing_item:
            # Si oui, mets à jour la quantité
            existing_item.quantity += quantity
            existing_item.save()
            response = Response({"message": "Quantité mise à jour dans le panier"}, status=status.HTTP_200_OK)
        else:
            # Sinon, crée l'élément normalement
            cart_item = serializer.save(user=user, anonymous_user_id=anonymous_user_id)
            response = Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

        # Si l'utilisateur est anonyme, on sauvegarde son anonymous_user_id dans les cookies
        if not user:
            response.set_cookie('anonymous_user_id', anonymous_user_id, max_age=3600*24*7)  # 7 jours par ex
            # response.data = {"message": "Article ajouté au panier"}
        return response


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
