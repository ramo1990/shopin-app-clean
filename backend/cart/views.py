from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated

# Create your views here.

# Panier
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Renvoie uniquement les items du panier de l’utilisateur connecté
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        # Vérifie si un CartItem existe déjà pour ce produit et cet utilisateur
        existing_item = CartItem.objects.filter(user=user, product=product).first()
        
        if existing_item:
            # Si oui, mets à jour la quantité
            existing_item.quantity += quantity
            existing_item.save()
        else:
            # Sinon, crée l'élément normalement
            serializer.save(user=user)
