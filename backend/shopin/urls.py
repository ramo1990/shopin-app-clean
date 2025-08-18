from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from django.conf import settings
# from dj_rest_auth.views import PasswordResetConfirmView
# from accounts.views import CSRFExemptPasswordResetView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('shop.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('payments.urls')),
    path('api/', include('core.urls')),
    path('api/custom-admin/', include('customAdmin.urls')),
    
    path('api/', include('dj_rest_auth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
