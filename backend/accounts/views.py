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
