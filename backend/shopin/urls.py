from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
from django.contrib.auth import views as auth_views
from dj_rest_auth.views import PasswordResetConfirmView
from django.views.decorators.csrf import csrf_exempt
from dj_rest_auth.views import PasswordResetView
from accounts.views import CSRFExemptPasswordResetView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    # Routes de l'app shop
    path('api/', include('shop.urls')),
    
    # Auth & password reset via dj-rest-auth
    path('api/', include('dj_rest_auth.urls')),
    # les vues classiques de Django
    # path('', include('django.contrib.auth.urls')), # Utilise les vues HTML de Django
    path('api/password/reset/', CSRFExemptPasswordResetView.as_view(), name="password_reset"),
    path('api/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
