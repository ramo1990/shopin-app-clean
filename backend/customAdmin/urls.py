from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.products import ProductViewSet
from .views.user import *
from .views.order import *
from .views.tags import TagViewSet
from .views.stats import AdminStatsView


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='admin-products')
router.register(r'tags', TagViewSet, basename='admin-tags')
router.register(r'users', UserViewSet, basename='admin-users')
router.register(r'orders', OrderViewSet, basename='admin-orders')

# urlpatterns = router.urls

urlpatterns = router.urls + [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
]