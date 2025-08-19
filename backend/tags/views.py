from rest_framework.generics import RetrieveAPIView,  ListAPIView
from rest_framework import generics
from .serializers import TagSerializer
from rest_framework.permissions import AllowAny
from .models import Tag
from products.models import Product
from products.serializers import ProductSerializer

class TagListAPIView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

# dit à DRF d'utiliser slug au lieu de l'id.
class TagDetailAPIView(RetrieveAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

class ProductByTagView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        tag_name = self.kwargs['tag_name']
        return Product.objects.filter(tags__name__iexact=tag_name)