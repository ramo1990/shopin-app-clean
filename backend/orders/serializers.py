from rest_framework import serializers
from .models import *
from products.serializers import ProductSerializer

# adresse de livraison
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [ 'id', 'full_name', 'address', 'city', 'postal_code', 'country', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

class OrderItemSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField() 
    product = ProductSerializer(read_only=True)  # Pour plus de détails sur le produit
    # Tu peux ajouter ici un nested product si tu veux plus de détails produit
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total', 'name']
    
    def get_total(self, obj):
        return float(obj.price) * obj.quantity

class OrderSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_method = serializers.CharField()  
     
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'total', 'payment_status', 'created_at']