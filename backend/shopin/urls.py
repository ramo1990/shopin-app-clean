from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Routes de l'app shop
    path('api/', include('shop.urls')),
    # Auth & password reset via dj-rest-auth
    path('api/', include('dj_rest_auth.urls')),
    # les vues classiques de Django
    path('', include('django.contrib.auth.urls')), # Utilise les vues HTML de Django

    path(
        'password-reset-confirm/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'  # correspond au reverse() attendu
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
