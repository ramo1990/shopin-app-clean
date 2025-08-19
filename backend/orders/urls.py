from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, TokenVerifyView)


urlpatterns = [
    path('orders/', CreateOrderView.as_view(), name='create-order'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('my-orders/', UserOrdersView.as_view(), name='user-orders'),
    path('shipping-address/', ShippingAddressCreateView.as_view(), name='shipping-address'),
    path('order-tracking/', OrderTrackingAPIView.as_view(), name='order-tracking'),

]