from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .serializers import *
from cart.models import CartItem
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics
from rest_framework import status, generics



# Je dois faire le tracking de la commande
# commande
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipping_address_id = request.data.get('shipping_address_id')
        payment_method = request.data.get('payment_method', 'card')

        if not shipping_address_id:
            return Response({"error": "Adresse de livraison requise"}, status=400)

        # Vérifie que l’adresse appartient à l’utilisateur connecté
        try:
            shipping_address = ShippingAddress.objects.get(id=shipping_address_id, user=request.user)
        except ShippingAddress.DoesNotExist:
            return Response({'error': 'Adresse invalide'}, status=400)

        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Panier vide"}, status=400)

        total = sum(item.product.price * item.quantity for item in cart_items)

        # Crée la commande avec l’adresse et le moyen de payment
        order = Order.objects.create(user=request.user, total=total, shipping_address=shipping_address, payment_method=payment_method)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()  # vider le panier
        return Response({"message": "Commande créée avec succès", "order_id": order.id, "payment_method": order.payment_method}, status=201)

# detail de la commande: Ce code filtre la commande par user=request.user, donc un utilisateur ne peut pas voir les commandes d’un autre.
class OrderDetailView(RetrieveAPIView):
    # queryset = Order.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=404)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
# commande de l'utilisateur connecté
class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')  # ou '-id'
    

# adresse de livraison
class ShippingAddressCreateView(ListCreateAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retourne uniquement les adresses de l'utilisateur connecté
        return ShippingAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        # Vérifie s’il existe déjà une adresse pour l’utilisateur
        existing_address = ShippingAddress.objects.filter(user=user).first()

        if existing_address:
            # Mise à jour : serializer avec instance existante
            serializer = self.get_serializer(existing_address, data=self.request.data)
        else:
            # Création : serializer sans instance
            serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
    
    # aficher l'erreur precise
    def create(self, request, *args, **kwargs):
        user = request.user
        existing_address = ShippingAddress.objects.filter(user=user).first()

        if existing_address:
            # Mise à jour de l'adresse existante
            serializer = self.get_serializer(existing_address, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("==== Serializer Errors ====")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        
        serializer.save(user=user)
        print("==== Adresse créée ====")
        print(serializer.data)      
        return Response(serializer.data, status=201)
    

class OrderTrackingAPIView(APIView):
    def get(self, request):
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({'error': 'order_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Essaie par order_id si défini, sinon fallback à id
            if order_id.startswith("SHOP"):
                order = Order.objects.get(order_id=order_id)
            else:
                order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Commande non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)