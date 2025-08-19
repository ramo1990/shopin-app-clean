from rest_framework.generics import RetrieveAPIView,  ListAPIView
from rest_framework import generics
from .models import *
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from django.db.models import Q
from rest_framework.permissions import AllowAny
from accounts.serializers import *
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

# User = get_user_model()

# Produit
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    permission_classes = [AllowAny]
    
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

# plusieurs images
class ProductImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]  # selon besoin

    def post(self, request, pk, format=None):
        product = Product.objects.get(pk=pk)
        serializer = MultipleProductImagesSerializer(data=request.data, context={'product': product})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Images uploaded successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
# recherche produit
@api_view(['GET'])
def search_products(request):
    query = request.GET.get('query', '')
    if query:
        products = Product.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query) | Q(tags__name__icontains=query)).distinct()
    else:
        products = Product.objects.none()
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Avis
class ProductReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['pk'])
        serializer.save(product=product, user=self.request.user)
