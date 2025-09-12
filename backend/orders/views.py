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
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import RetrieveUpdateAPIView


# Je dois faire le tracking de la commande
# commande
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Données reçues:", request.data)
        shipping_address_id = request.data.get('shipping_address_id')
        payment_method = request.data.get('payment_method', 'card')
        shipping_method = request.data.get('shipping_method', 'standard')

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

        # Vérifie s’il existe une commande "draft" pour l’utilisateur
        order, created = Order.objects.get_or_create(
            user=request.user,
            status='draft',
            defaults={
                'total': total,
                'shipping_address': shipping_address,
                'shipping_method': shipping_method,
                'payment_method': payment_method,
            }
        )
        if not created:
            # Mettre à jour les infos si la commande existe déjà
            order.total = total
            order.shipping_address = shipping_address
            order.shipping_method = shipping_method
            order.payment_method = payment_method

            # Supprimer les anciens articles
            order.items.all().delete()

        # Crée la commande avec l’adresse et le moyen de payment
        # order = Order.objects.create(user=request.user, 
        #                              total=total, 
        #                              shipping_address=shipping_address,
        #                              shipping_method=shipping_method, 
        #                              payment_method=payment_method)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                name=item.product.title,
                quantity=item.quantity,
                price=item.product.price
                # created_by=request.CustomUser
            )

        # Recalculer les frais et le total final
        order.grand_total = order.total + order.calculate_delivery_fee()
        order.save()

        return Response({
            "message": "Commande créée avec succès", 
            "order_id": order.id, 
            "payment_method": order.payment_method,
            "shipping_method": order.shipping_method,
            "delivery_fee": float(order.calculate_delivery_fee()),
            "grand_total": float(order.grand_total),
            }, status=201)

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
        serializer.save(user=user)
    


class ShippingAddressRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Restreindre les adresses à celles de l'utilisateur connecté
        return ShippingAddress.objects.filter(user=self.request.user)
    
# mode payment et adresse
class OrderRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        print("shipping_method reçu dans PATCH:", request.data.get('shipping_method'))
        shipping_address_id = request.data.get('shipping_address_id')
        payment_method = request.data.get('payment_method')
        shipping_method = request.data.get('shipping_method')

        if shipping_address_id:
            try:
                shipping_address = ShippingAddress.objects.get(id=shipping_address_id, user=request.user)
            except ShippingAddress.DoesNotExist:
                return Response({'error': 'Adresse invalide'}, status=status.HTTP_400_BAD_REQUEST)
            order.shipping_address = shipping_address

        if payment_method:
            if payment_method not in ['card', 'paypal', 'cod']:
                return Response({'error': 'Méthode de paiement invalide'}, status=status.HTTP_400_BAD_REQUEST)
            order.payment_method = payment_method
        
        if shipping_method:
            if shipping_method not in ['standard', 'express']:
                return Response({'error': 'Méthode de livraison invalide'}, status=status.HTTP_400_BAD_REQUEST)
            order.shipping_method = shipping_method

        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)



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