from rest_framework import serializers
from .models import *

# Tags
class TagSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'image', 'slug']