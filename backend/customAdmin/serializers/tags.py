from rest_framework import serializers
from shop.models import Tag

class TagSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'image', 'created_by', 'updated_by']
