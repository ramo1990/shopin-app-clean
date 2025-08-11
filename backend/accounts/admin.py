from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import ModelForm, CharField, PasswordInput
from .models import CustomUser
from django.core.exceptions import ValidationError


class CustomUserCreationForm(ModelForm):
    password1 = CharField(label='Mot de passe', widget=PasswordInput)
    password2 = CharField(label='Confirmation du mot de passe', widget=PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('email', 'username')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Les mots de passe ne correspondent pas.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(ModelForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'first_name', 'last_name', 'phone', 'is_active', 'is_staff', 'is_superuser')

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'username', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    ordering = ('email',)
    search_fields = ('email', 'username')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Infos personnelles', {'fields': ('username', 'first_name', 'last_name', 'phone')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active', 'is_superuser')}
        ),
    )
