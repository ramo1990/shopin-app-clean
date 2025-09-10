from django.db import models
from django.conf import settings
from products.models import Product
from django.utils import timezone
from datetime import timedelta
import uuid
from accounts.models import CustomUser

# adresse de livraison
class ShippingAddress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, related_name='shippings_created', on_delete=models.SET_NULL, null=True, blank=True) # audit
    updated_by = models.ForeignKey(CustomUser, related_name='shippings_updated', on_delete=models.SET_NULL, null=True, blank=True) # audit

    def __str__(self):
        return f"{self.full_name}, {self.address}"
    
    class Meta:
        verbose_name = "Adresse de livraison"
        verbose_name_plural = "Adresses de livraison"

# Commandes
class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Carte bancaire'),
        # ('paypal', 'PayPal'),
        ('cod', 'Paiement à la livraison'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True, blank=True)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.SET_NULL, null=True)
    shipping_method = models.CharField(max_length=50, choices=[('standard', 'Standard'), ('express', 'Express')], default='standard')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='card')
    payment_status = models.CharField(max_length=20, default='pending')  # pending, paid, failed
    expected_delivery = models.DateField(default=timezone.now() + timedelta(days=3))
    status = models.CharField(max_length=100, default='en attente')
    created_at = models.DateTimeField(auto_now_add=True)
    stripe_checkout_id = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='orders_created', on_delete=models.SET_NULL, null=True, blank=True) # audit
    updated_by = models.ForeignKey(CustomUser, related_name='orders_updated', on_delete=models.SET_NULL, null=True, blank=True) # audit

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f"SHOP{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Commande #{self.id} - {self.user.username}"
    
    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, default="Produit inconnu")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(CustomUser, related_name='orderItems_created', on_delete=models.SET_NULL, null=True, blank=True) # audit
    updated_by = models.ForeignKey(CustomUser, related_name='orderItems_updated', on_delete=models.SET_NULL, null=True, blank=True) # audit

    def __str__(self):
        return f"{self.quantity} x {self.name}"
    
    class Meta:
        verbose_name = "Article de la commande"
        verbose_name_plural = "Articles de la commande"