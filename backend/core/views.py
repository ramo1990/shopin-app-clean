from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from .serializers import *
from django.core.mail import send_mail 
from django.conf import settings
from rest_framework.response import Response
from accounts.models import CustomUser
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django_ratelimit.decorators import ratelimit
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_str
from rest_framework import status
from django.utils.http import urlsafe_base64_decode
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate




# page contact: enregistre et envoie de message
@api_view(['POST'])
def contact_message_view(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        contact_message = serializer.save()

        # Envoi de l'email (sera affiché dans la console)
        send_mail(
            subject=f"Nouveau message de contact : {contact_message.name}",
            message=(
                f"Nom: {contact_message.name}\n"
                f"Email: {contact_message.email}\n\n"
                f"Message:\n{contact_message.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_RECEIVER_EMAIL],
            fail_silently=False,
        )

        return Response({"message": "Message reçu, email affiché en console."}, status=201)

    return Response(serializer.errors, status=400)


# Envoi d'Email de verification
@api_view(['POST'])
def send_verification_email(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email requis"}, status=400)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=404)

    # Génération du token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # Construire le lien de vérification, par exemple :
    verification_url = f"{settings.FRONTEND_URL}/verify-email/?uid={uid}&token={token}"

    # Message avec lien cliquable
    message = (
        f"Merci de vous être inscrit.\n"
        f"Veuillez cliquer sur le lien suivant pour vérifier votre adresse email :\n\n"
        f"{verification_url}\n\n"
        f"Si vous n'avez pas fait cette demande, ignorez cet email."
    )

    send_mail(
        subject='Vérification de votre adresse email',
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
    
    user.email_verification_sent_at = timezone.now()
    user.save()

    return Response({"message": "Email envoyé avec succès"}, status=200)


# Re-envoi d'Email de verification
@ratelimit(key='user', rate='1/m', method='POST', block=True)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification_email(request):
    user = request.user

    if user.is_active:
        return Response({"message": "Votre compte est déjà activé."}, status=400)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verification_url = f"{settings.FRONTEND_URL}/verify-email/?uid={uid}&token={token}"

    message = (
        f"Bonjour {user.username},\n\n"
        f"Voici le lien pour vérifier votre adresse email :\n\n"
        f"{verification_url}\n\n"
        f"Si vous n’avez pas demandé cela, ignorez simplement cet email."
    )

    send_mail(
        subject="Nouveau lien de vérification",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

    user.email_verification_sent_at = timezone.now()
    user.save()

    return Response({"message": "Lien de vérification renvoyé avec succès."})


# confirmer l'email
@csrf_exempt
@api_view(['POST'])
def verify_email(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')

    if not uidb64 or not token:
        return Response({"error": "UID et token sont requis."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        return Response({"error": "Utilisateur invalide."}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifie si le lien a expiré (1h ici)
    if user.email_verification_sent_at:
        expiration_time = user.email_verification_sent_at + timezone.timedelta(hours=1)
        if timezone.now() > expiration_time:
            return Response({"error": "Le lien a expiré. Veuillez en demander un nouveau."}, status=400)

    # Vérifie le token
    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.email_verification_sent_at = None # desactive le timestamp
        user.save()
        return Response({"message": "Email vérifié avec succès."}, status=200)
    else:
        return Response({"error": "Token invalide ou expiré."}, status=400)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email_with_credentials(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"detail": "Nom d'utilisateur et mot de passe requis."}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({
            "detail": "Identifiants incorrects.",
            "code": "invalid_credentials"
        }, status=401)

    if user.is_active:
        return Response({
            "detail": "Votre compte est déjà activé.",
            "code": "already_active"
        }, status=400)

    # Génère le lien
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_url = f"{settings.FRONTEND_URL}/verify-email/?uid={uid}&token={token}"

    message = (
        f"Bonjour {user.username},\n\n"
        f"Voici le lien pour vérifier votre adresse email :\n\n"
        f"{verification_url}\n\n"
        f"Si vous n’avez pas demandé cela, ignorez simplement cet email."
    )

    send_mail(
        subject="Lien de vérification",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

    user.email_verification_sent_at = timezone.now()
    user.save()

    return Response({"message": "Lien de vérification renvoyé avec succès."})