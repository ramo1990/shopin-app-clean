from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import *
from django.contrib.auth.hashers import make_password
from accounts.models import CustomUser
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

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

# avis
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

# Contact page
# class ContactMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ContactMessage
#         fields = ['id', 'name', 'email', 'message', 'created_at']
#         read_only_fields = ['id', 'created_at']


User = get_user_model()
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise AuthenticationFailed({
                "detail": "Identifiants incorrects",
                "code": "invalid_credentials"
            })

        if not check_password(password, user.password):
            raise AuthenticationFailed({
                "detail": "Identifiants incorrects.",
                "code": "invalid_credentials"
            })
        
        if not user.is_active:
            raise AuthenticationFailed({
                "detail": "Votre compte n’est pas encore activé. Vérifiez votre email",
                "code": "email_not_verified"
            })

        return super().validate(attrs)