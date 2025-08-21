from django.db import models
from django.conf import settings
from products.models import Product
from accounts.models import CustomUser
import uuid


# Panier
class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='cart_items')
    anonymous_user_id = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ['user', 'anonymous_user_id', 'product']
        verbose_name = "Article dans le panier"
        verbose_name_plural = "Articles dans le panier"

    def __str__(self):
        return f"{self.product.title} x {self.quantity}"