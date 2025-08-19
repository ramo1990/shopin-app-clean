from django.contrib import admin
from .models import *


# Register your models here.
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}