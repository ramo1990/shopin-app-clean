from rest_framework import serializers
from orders.models import Order  # remplace par ton modèle

class OrderSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    updated_by = serializers.StringRelatedField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user', queryset=__import__('django.contrib.auth').contrib.auth.get_user_model().objects.all()
    )

    class Meta:
        model = Order
        # user_id permet de lier l'utilisateur via son identifiant
        fields = ['id', 'user_id', 'total_price', 'is_paid', 'created_at', 'paid_at']
        read_only_fields = ['id', 'created_at', 'paid_at', 'updated_by', 'created_by']
