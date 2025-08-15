from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import *

# Tags
class TagSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'image', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    rating_distribution = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'image', 'stock', 'slug','tags',
                  'average_rating', 'total_reviews', 'rating_distribution']

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

# avis
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']
