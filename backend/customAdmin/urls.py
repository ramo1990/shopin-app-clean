from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, TagViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='admin-products')
router.register(r'tags', TagViewSet, basename='admin-tags')

urlpatterns = router.urls
