from rest_framework import serializers
from .models import CustomUser
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import check_password


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


User = get_user_model()
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise AuthenticationFailed({
                "detail": "Identifiants incorrects",
                "code": "invalid_credentials"
            })

        if not check_password(password, user.password):
            raise AuthenticationFailed({
                "detail": "Identifiants incorrects.",
                "code": "invalid_credentials"
            })
        
        if not user.is_active:
            raise AuthenticationFailed({
                "detail": "Votre compte n’est pas encore activé. Vérifiez votre email",
                "code": "email_not_verified"
            })

        return super().validate(attrs)