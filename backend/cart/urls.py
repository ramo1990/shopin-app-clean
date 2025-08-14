# from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'cart', CartItemViewSet, basename= 'cart')

urlpatterns = [
    path('', include(router.urls)),
]