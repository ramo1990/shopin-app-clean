# from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *


urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/create/', ProductCreateView.as_view(), name='product-create'),
    path('products/<int:pk>/edit/', ProductUpdateView.as_view(), name='product-edit'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/upload-images/', ProductImageUploadView.as_view(), name='product-image-upload'),
    path('products/<int:pk>/reviews/', ProductReviewCreateView.as_view(), name='product-review-create'),
    path('search/', search_products, name='product-search'),
]