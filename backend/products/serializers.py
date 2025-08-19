from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import *
from tags.serializers import TagSerializer

# image
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']
        
class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    rating_distribution = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'images', 'stock', 'slug','tags',
                  'average_rating', 'total_reviews', 'rating_distribution', 'available', 'created_at', 'updated_at']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_total_reviews(self, obj):
        return obj.reviews.count()

    def get_rating_distribution(self, obj):
        distribution = {i: 0 for i in range(1, 6)}
        for review in obj.reviews.all():
            distribution[review.rating] += 1
        return distribution

# plusieurs images
class MultipleProductImagesSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False
    )

    def create(self, validated_data):
        product = self.context['product']
        images = validated_data.get('images')
        created_images = []
        for image in images:
            img_obj = ProductImage.objects.create(product=product, image=image)
            created_images.append(img_obj)
        return created_images
# avis
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']
