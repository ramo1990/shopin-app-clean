from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from products.models import Product
from customAdmin.serializers.products import ProductSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        return serializer.save(updated_by=self.request.user)