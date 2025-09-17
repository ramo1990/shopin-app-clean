from django.db import models
from django.conf import settings
from products.models import Product
from django.utils import timezone
from datetime import timedelta
import uuid
from accounts.models import CustomUser
from decimal import Decimal

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
    PAYMENT_METHOD_CHOICES = [('card', 'Carte bancaire'),
        # ('paypal', 'PayPal'),
        ('cod', 'Paiement à la livraison'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),          # non validée, en cours de création
        ('pending', 'En attente de paiement'),       # validée mais pas encore payée
        ('paid', 'Payée'),
        ('shipped', 'Expédiée'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True, blank=True)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.SET_NULL, null=True)
    shipping_method = models.CharField(max_length=50, choices=[('standard', 'Standard'), ('express', 'Express')], default='standard')

    total = models.DecimalField(max_digits=10, decimal_places=2)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ total avec livraison
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='card')
    payment_status = models.CharField(max_length=20, default='pending')  # pending, paid, failed
    expected_delivery = models.DateField(default=timezone.now() + timedelta(days=3))
    status = models.CharField(max_length=100,choices=STATUS_CHOICES, default='draft')

    created_at = models.DateTimeField(auto_now_add=True)
    stripe_checkout_id = models.CharField(max_length=255, blank=True, null=True)

    customer_email = models.EmailField(blank=True, null=True)
    customer_first_name = models.CharField(max_length=100, blank=True, null=True)
    customer_last_name = models.CharField(max_length=100, blank=True, null=True)
    customer_phone = models.CharField(max_length=20, blank=True, null=True)

    created_by = models.ForeignKey(CustomUser, related_name='orders_created', on_delete=models.SET_NULL, null=True, blank=True) # audit
    updated_by = models.ForeignKey(CustomUser, related_name='orders_updated', on_delete=models.SET_NULL, null=True, blank=True) # audit

    def calculate_delivery_fee(self):
        if self.shipping_method == 'standard':
            return Decimal('0.00')
        elif self.shipping_method == 'express':
            return Decimal('0.00') if self.total >= Decimal('20000.00') else Decimal('2000.00')
        return Decimal('2000.00')

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f"SHOP{uuid.uuid4().hex[:8].upper()}"
        # Calcul du montant total avec livraison
        delivery_fee = self.calculate_delivery_fee()
        self.grand_total = self.total + delivery_fee
        # Dé-normaliser les données client au moment de la sauvegarde
        if self.user:
            self.customer_email = self.user.email
            self.customer_first_name = self.user.first_name
            self.customer_last_name = self.user.last_name

        if self.shipping_address:
            self.customer_phone = self.shipping_address.phone
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