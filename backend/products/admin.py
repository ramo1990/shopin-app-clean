from django.contrib import admin
from .models import *


# plusieurs images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # nombre de formulaires vides par défaut

# produit
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'stock', 'available')
    search_fields = ('title',)
    list_filter = ('price',)
    prepopulated_fields = {"slug": ("title",)} 
    inlines = [ProductImageInline]

# variant image
class ProductVariantImageInline(admin.TabularInline):
    model = ProductVariantImage
    extra = 1

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'color', 'size', 'price', 'stock', 'available')
    list_filter = ('product', 'color', 'size', 'available')
    inlines = [ProductVariantImageInline]
