from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views
from accounts.forms import CustomPasswordResetForm


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path('existing_user/<str:email>/', existing_user, name='existing_user'),
    path('create_user/', create_user, name= 'create_user'),
    path('login/', LoginView.as_view(), name='login'),
    # path("reset-password-confirm/", CustomPasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('password/reset/confirm/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('password/reset/', auth_views.PasswordResetView.as_view(form_class=CustomPasswordResetForm), name='password_reset'),
    ]