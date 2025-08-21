from django.contrib import admin
from .models import *


# Register your models here.
# admin.site.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity', 'user', 'anonymous_user_id']

    def save_model(self, request, obj, form, change):
        # Si l'utilisateur est connecté, on associe l'utilisateur au cart item
        if not obj.user:
            if not obj.anonymous_user_id:
                obj.anonymous_user_id = uuid.uuid4()  # Crée un ID anonyme s'il n'y en a pas
        super().save_model(request, obj, form, change)

admin.site.register(CartItem, CartItemAdmin)