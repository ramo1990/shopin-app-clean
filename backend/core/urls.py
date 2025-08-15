from django.urls import path
from .views import *


urlpatterns = [
    path('contact/', contact_message_view, name='contact-message'),
    path('send-verification-email/', send_verification_email, name='send-verification-email'),
    path('verify-email/', verify_email, name='verify-email'),
    path('resend-verification-email/', resend_verification_email),
    path("resend-verification-email-with-credentials/", resend_verification_email_with_credentials),
]