from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from customAdmin.serializers.user import UserSerializer

User = get_user_model()

# admin/staff peut lister, créer, modifier et supprimer les utilisateurs
class IsAdminStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminStaff]
