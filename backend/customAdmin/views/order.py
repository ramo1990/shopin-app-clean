from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model
from orders.models import Order
from customAdmin.serializers.order import OrderSerializer


User = get_user_model()

# Seuls les utilisateurs staff peuvent accéder aux commandes (IsAdminStaff).
class IsAdminStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

# ModelViewSet fournit les opérations CRUD.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminStaff]

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        return serializer.save(updated_by=self.request.user)