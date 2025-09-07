from django.contrib import admin
from .models import *


# Register your models here.
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    list_filter = ('parent',)
    prepopulated_fields = {"slug": ("name",)}