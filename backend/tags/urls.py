# from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *


urlpatterns = [
    path('tags/', TagListAPIView.as_view(), name='tag-list'), 
    path('tags/<slug:slug>/', TagDetailAPIView.as_view(), name='tag-detail'),
    path('products/by-tag/<str:tag_name>/', ProductByTagView.as_view(), name='products-by-tag'), 
]