from rest_framework import serializers
from .models import CustomUser
from rest_framework.validators import UniqueValidator
from dj_rest_auth.serializers import PasswordResetSerializer
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="Email déjà utilisé")]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="Nom d'utilisateur déjà pris")]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "password", "first_name", "last_name")
    
    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
    
# # user connecté
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# confirmation de mdp
# class CustomPasswordResetSerializer(PasswordResetSerializer):
#     def get_email_options(self):
#         user = get_user_model().objects.get(email=self.data["email"])

#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         token = default_token_generator.make_token(user)

#         # Rediriger vers ton frontend, pas Django
#         reset_url = f"http://localhost:3000/reset-password-confirm?uid={uid}&token={token}"

#         return {
#             "subject_template_name": "registration/password_reset_subject.txt",
#             "email_template_name": "registration/password_reset_email.html",
#             "extra_email_context": {
#                 "reset_url": reset_url
#             }
#         }