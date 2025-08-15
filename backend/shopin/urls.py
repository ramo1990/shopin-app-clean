from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
from dj_rest_auth.views import PasswordResetConfirmView
from accounts.views import CSRFExemptPasswordResetView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('shop.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('payments.urls')),
    path('api/', include('core.urls')),
    path('api/', include('customAdmin.urls')),
    
    path('api/', include('dj_rest_auth.urls')),
    # path('', include('django.contrib.auth.urls')), # Utilise les vues HTML de Django
    # path('api/password/reset/', CSRFExemptPasswordResetView.as_view(), name="password_reset"),
    # path('api/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
