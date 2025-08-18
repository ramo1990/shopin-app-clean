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
    tags = models.ManyToManyField('Tag', blank=True)
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

# categorie des produits
class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=False, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='tags_created', on_delete=models.SET_NULL, null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, related_name='tags_updated', on_delete=models.SET_NULL, null=True, blank=True)


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Catégorie de produit"
        verbose_name_plural = "Catégories de produits"
    
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