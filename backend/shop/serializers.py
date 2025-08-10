from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth.hashers import make_password


# Tags
class TagSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'image', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    rating_distribution = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'stock', 'slug','tags',
                  'average_rating', 'total_reviews', 'rating_distribution']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_total_reviews(self, obj):
        return obj.reviews.count()

    def get_rating_distribution(self, obj):
        distribution = {i: 0 for i in range(1, 6)}
        for review in obj.reviews.all():
            distribution[review.rating] += 1
        return distribution
    
# Panier
class CartItemSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='product.title')
    image = serializers.ImageField(source='product.image', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'title', 'image', 'price', 'quantity']

# adresse de livraison
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [ 'id', 'full_name', 'address', 'city', 'postal_code', 'country', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

# user connecté
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# avis
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

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
    # estimated_delivery = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'total', 'payment_status', 'created_at']
    
    # def get_estimated_delivery(self, obj):
    #     # Par exemple, livraison 7 jours après création
    #     from datetime import timedelta
    #     if obj.created_at:
    #         return (obj.created_at + timedelta(days=7)).strftime('%d/%m/%Y')
    #     return None

# s'inscrire
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email = validated_data["email"],
            password= validated_data["password"],
            first_name=validated_data.get("first_name"),
            last_name = validated_data.get("last_name"),
        ) # crée l'utilisateur
        # validated_data["password"] = make_password(validated_data["password"])
        # user = User.objects.create(**validated_data)  # crée l'utilisateur
        return user

# Contact page
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']