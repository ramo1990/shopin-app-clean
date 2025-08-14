from django.db import models
from django.conf import settings
from shop.models import Product


# Panier
class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.product.title} x {self.quantity}"
    
    class Meta:
        verbose_name = "Article dans le panier"
        verbose_name_plural = "Articles dans le panier"