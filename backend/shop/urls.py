# backend/shop/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, TokenVerifyView)


router = DefaultRouter()
router.register(r'cart', CartItemViewSet, basename= 'cart')

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("me/", CurrentUserView.as_view(), name='current-user'),
    path('tags/', TagListAPIView.as_view(), name='tag-list'), 
    path('tags/<slug:slug>/', TagDetailAPIView.as_view(), name='tag-detail'),
    path('products/by-tag/<str:tag_name>/', ProductByTagView.as_view(), name='products-by-tag'), 
    path('products/<int:pk>/reviews/', ProductReviewCreateView.as_view(), name='product-review-create'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('my-orders/', UserOrdersView.as_view(), name='user-orders'),
    path('shipping-address/', ShippingAddressCreateView.as_view(), name='shipping-address'),
    path('checkout-session/<int:order_id>/', CreateCheckoutSessionView.as_view(), name='checkout-session'),
    path("register/", RegisterView.as_view(), name="register"),
    path('existing_user/<str:email>/', existing_user, name='existing_user'),
    path('create_user/', create_user, name= 'create_user'),
    path('search/', search_products, name='product-search'),
    path("get_address/", GetAddressByEmailOrPhoneView.as_view(), name='get-address'),
    path('contact/', contact_message_view, name='contact-message'),
    path('order-tracking/', OrderTrackingAPIView.as_view(), name='order-tracking'),
    path("webhook/stripe/", stripe_webhook, name="stripe-webhook"),
]

urlpatterns += router.urls