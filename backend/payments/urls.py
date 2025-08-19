from django.urls import path
from .views import *


urlpatterns = [
    path('checkout-session/<int:order_id>/', CreateCheckoutSessionView.as_view(), name='checkout-session'),
    path("webhook/stripe/", stripe_webhook, name="stripe-webhook"),
]