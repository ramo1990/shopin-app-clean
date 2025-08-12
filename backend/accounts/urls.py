from django.urls import path
from .views import *


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path('existing_user/<str:email>/', existing_user, name='existing_user'),
    path('create_user/', create_user, name= 'create_user'),
]