from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import CustomUser
from .models import *
from rest_framework.response import Response
# from django.contrib.auth.models import User
from .serializers import *
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

    
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Utilisateur créé avec succès"}, status=201)
        return Response(serializer.errors, status=400)
    
# Vérifie si un utilisateur existe par email
@api_view(['GET'])
def existing_user(request, email):
    try:
        user = CustomUser.objects.get(email=email)
        return Response({"exists": True, "id": user.id})
    except CustomUser.DoesNotExist:
        return Response({"exists": False}, status=status.HTTP_404_NOT_FOUND)

# Crée un utilisateur à partir des infos envoyées par Google OAuth
@api_view(['POST'])
def create_user(request):
    data = request.data
    email = data.get("email")
    username = data.get("username")

    if not email or not username:
        return Response({"error": "email and username are required"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(
        email=email,
        username=username,
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
        password=CustomUser.objects.make_random_password()
    )

    return Response({"message": "User created successfully", "id": user.id}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"detail": "Email et mot de passe requis."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {"detail": "Informations erronées."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {
                    "detail": "Votre compte n’est pas encore activé.",
                    "code": "email_not_verified"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        })
