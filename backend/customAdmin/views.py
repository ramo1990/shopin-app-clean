from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from shop.models import Product, Tag
from .serializers import ProductSerializer, TagSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [IsAdminUser]
