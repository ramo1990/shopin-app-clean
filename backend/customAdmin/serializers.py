from rest_framework import serializers
from shop.models import Product, Tag, Review

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'image']

class ProductSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), write_only=True, source='tags'
    )

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description',
            'price', 'image', 'stock',
            'created_at', 'tags', 'tag_ids'
        ]
        read_only_fields = ['slug', 'created_at']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True}
        }

    # rendre l'image optionnelle en mode modif
    def validate_image(self, value):
            if self.instance and not value:
                # Si en mode update et pas de nouvelle image : OK
                return self.instance.image
            return value