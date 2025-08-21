from django.db import models
from django.utils.text import slugify
from django.conf import settings
from accounts.models import CustomUser

# produits
class Product(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    stock = models.PositiveIntegerField()
    available = models.BooleanField(default=True)
    tags = models.ManyToManyField('tags.Tag', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, related_name='products_created', on_delete=models.SET_NULL, null=True, blank=True) # audit
    updated_by = models.ForeignKey(CustomUser, related_name='products_updated', on_delete=models.SET_NULL, null=True, blank=True) # audit

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"

# image multiple
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=255, blank=True)

# produit variant
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='variant_images/', null=True, blank=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.title} - {self.color} {self.size}"

# images variants
class ProductVariantImage(models.Model):
    variant = models.ForeignKey('ProductVariant', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='variant_images/')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.variant}"


# commentaire et note
class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1 à 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avis de {self.user} sur {self.product}"
    
    class Meta:
        verbose_name = "Avis"
        verbose_name_plural = "Avis"