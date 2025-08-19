from django.contrib import admin
from .models import *


# plusieurs images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # nombre de formulaires vides par défaut


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'stock', 'available')
    search_fields = ('title',)
    list_filter = ('price',)
    prepopulated_fields = {"slug": ("title",)} 
    inlines = [ProductImageInline]

