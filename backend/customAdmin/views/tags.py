from rest_framework import viewsets, permissions, filters
from tags.models import Tag
from customAdmin.serializers.tags import TagSerializer


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'slug']

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        return serializer.save(updated_by=self.request.user)
