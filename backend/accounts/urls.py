from django.urls import path
from .views import *
# from accounts.forms import CustomPasswordResetForm
from rest_framework_simplejwt.views import (TokenRefreshView, TokenVerifyView)


urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("register/", RegisterView.as_view(), name="register"),
    path('existing_user/<str:email>/', existing_user, name='existing_user'),
    path('create_user/', create_user, name= 'create_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/reset/confirm/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("me/", CurrentUserView.as_view(), name='current-user'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("get_address/", GetAddressByEmailOrPhoneView.as_view(), name='get-address'),
    path('password/reset/', CSRFExemptPasswordResetView.as_view(), name="password_reset"),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    ]