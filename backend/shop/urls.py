# backend/shop/urls.py
# from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *


urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('tags/', TagListAPIView.as_view(), name='tag-list'), 
    path('tags/<slug:slug>/', TagDetailAPIView.as_view(), name='tag-detail'),
    path('products/by-tag/<str:tag_name>/', ProductByTagView.as_view(), name='products-by-tag'), 
    path('products/<int:pk>/reviews/', ProductReviewCreateView.as_view(), name='product-review-create'),
    path('search/', search_products, name='product-search'),
]