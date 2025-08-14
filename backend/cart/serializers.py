from rest_framework import serializers
from .models import *


# Panier
class CartItemSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='product.title')
    image = serializers.ImageField(source='product.image', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'title', 'image', 'price', 'quantity']