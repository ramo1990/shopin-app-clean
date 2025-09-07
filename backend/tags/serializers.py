from rest_framework import serializers
from .models import *


# subcategory
class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'image']

# Tags
class TagSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'image', 'slug', 'parent', 'subcategories']