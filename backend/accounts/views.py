from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import CustomUser
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from orders.models import ShippingAddress
from orders.serializers import ShippingAddressSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
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

# Reset password 
@method_decorator(csrf_exempt, name='dispatch')
class CSRFExemptPasswordResetView(PasswordResetView):
    pass

class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    def form_valid(self, form):
        user = form.save()
        return Response({
            'detail': 'Password has been reset.',
            'username': user.username
        }, status=status.HTTP_200_OK)
    
# utilisateur connecté
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GetAddressByEmailOrPhoneView(APIView):
    permission_classes = [AllowAny]  # ou [IsAuthenticated]

    def get(self, request):
        email = request.GET.get("email")
        phone = request.GET.get("phone")
        if not email and not phone:
            return Response({"error": "Email ou numéro de téléphone requis"}, status=400)

        try:
            user = User.objects.filter(Q(email=email) | Q(addresses__phone=phone)).distinct().first()
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=404)

        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=404)
        
        address = ShippingAddress.objects.filter(user=user).first()
        if not address:
            return Response(None, status=200)  # Aucun contenu

        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data, status=200)