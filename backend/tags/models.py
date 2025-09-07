from django.db import models
from django.utils.text import slugify
from accounts.models import CustomUser


# categorie des produits
class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=False, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_by = models.ForeignKey(CustomUser, related_name='tags_created', on_delete=models.SET_NULL, null=True, blank=True)
    updated_by = models.ForeignKey(CustomUser, related_name='tags_updated', on_delete=models.SET_NULL, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subcategories', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Catégorie de produit"
        verbose_name_plural = "Catégories de produits"