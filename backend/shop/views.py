from rest_framework.generics import RetrieveAPIView,  ListAPIView, CreateAPIView, ListCreateAPIView
from rest_framework import viewsets, permissions, status, generics
from .models import *
from .serializers import ProductSerializer, CartItemSerializer, TagSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import *
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail 
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
# from django.views.decorators.csrf import csrf_exempt
from accounts.serializers import *
from django_ratelimit.decorators import ratelimit
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


# User = get_user_model()

# Produit
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class TagListAPIView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

# dit à DRF d'utiliser slug au lieu de l'id.
class TagDetailAPIView(RetrieveAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

class ProductByTagView(generics.ListAPIView):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        tag_name = self.kwargs['tag_name']
        return Product.objects.filter(tags__name__iexact=tag_name)
# Panier
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Renvoie uniquement les items du panier de l’utilisateur connecté
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        # Vérifie si un CartItem existe déjà pour ce produit et cet utilisateur
        existing_item = CartItem.objects.filter(user=user, product=product).first()
        
        if existing_item:
            # Si oui, mets à jour la quantité
            existing_item.quantity += quantity
            existing_item.save()
        else:
            # Sinon, crée l'élément normalement
            serializer.save(user=user)

# commande
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipping_address_id = request.data.get('shipping_address_id')
        payment_method = request.data.get('payment_method', 'card')

        if not shipping_address_id:
            return Response({"error": "Adresse de livraison requise"}, status=400)

        # Vérifie que l’adresse appartient à l’utilisateur connecté
        try:
            shipping_address = ShippingAddress.objects.get(id=shipping_address_id, user=request.user)
        except ShippingAddress.DoesNotExist:
            return Response({'error': 'Adresse invalide'}, status=400)

        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Panier vide"}, status=400)

        total = sum(item.product.price * item.quantity for item in cart_items)

        # Crée la commande avec l’adresse et le moyen de payment
        order = Order.objects.create(user=request.user, total=total, shipping_address=shipping_address, payment_method=payment_method)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()  # vider le panier
        return Response({"message": "Commande créée avec succès", "order_id": order.id, "payment_method": order.payment_method}, status=201)

# detail de la commande: Ce code filtre la commande par user=request.user, donc un utilisateur ne peut pas voir les commandes d’un autre.
class OrderDetailView(RetrieveAPIView):
    # queryset = Order.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=404)

        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
# recherche produit
@api_view(['GET'])
def search_products(request):
    query = request.GET.get('query', '')
    if query:
        products = Product.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query) | Q(tags__name__icontains=query)).distinct()
    else:
        products = Product.objects.none()
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# commande de l'utilisateur connecté
class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')  # ou '-id'

# adresse de livraison
class ShippingAddressCreateView(ListCreateAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retourne uniquement les adresses de l'utilisateur connecté
        return ShippingAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        # Vérifie s’il existe déjà une adresse pour l’utilisateur
        existing_address = ShippingAddress.objects.filter(user=user).first()

        if existing_address:
            # Mise à jour : serializer avec instance existante
            serializer = self.get_serializer(existing_address, data=self.request.data)
        else:
            # Création : serializer sans instance
            serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
    
    # aficher l'erreur precise
    def create(self, request, *args, **kwargs):
        user = request.user
        existing_address = ShippingAddress.objects.filter(user=user).first()

        if existing_address:
            # Mise à jour de l'adresse existante
            serializer = self.get_serializer(existing_address, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("==== Serializer Errors ====")
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        
        serializer.save(user=user)
        print("==== Adresse créée ====")
        print(serializer.data)      
        return Response(serializer.data, status=201)

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

# Avis
class ProductReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['pk'])
        serializer.save(product=product, user=self.request.user)

# mode de paiement
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)

        success_url = f'{settings.FRONTEND_URL}/confirmation/{order.id}'
        cancel_url = f'{settings.FRONTEND_URL}/cancel'
        print("🔙 cancel_url:", cancel_url)
        # cancel_url = request.build_absolute_uri(f'/payment/{order.id}')

        # creation de la section stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'unit_amount': int(order.total * 100),  # en centimes
                    'product_data': {'name': f'Commande #{order.id}'},
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
        )
        order.stripe_checkout_id = session.id
        order.save()

        print(f"Session Stripe créée avec ID: {session.id}")
        print(f"stripe_checkout_id dans la DB pour order {order.id} : {order.stripe_checkout_id}")

        return Response({"sessionId": session.id})

# Valider le paiement
def paiement_valide(order_id):
    try:
        order = Order.objects.get(order_id=order_id)
        order.payment_status = 'paid'  # ou "success"
        order.save()
    except Order.DoesNotExist:
        # Gérer l'erreur
        pass

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

# Resend verification Email
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

# token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class OrderTrackingAPIView(APIView):
    def get(self, request):
        order_id = request.query_params.get('order_id')
        if not order_id:
            return Response({'error': 'order_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Essaie par order_id si défini, sinon fallback à id
            if order_id.startswith("SHOP"):
                order = Order.objects.get(order_id=order_id)
            else:
                order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Commande non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)

# Stipe webhook
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

@csrf_exempt
def stripe_webhook(request):
    print("==> Webhook Stripe reçu")
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET  # à définir dans .env
    # event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        print("⚠️ Payload invalide:", e)
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        print("⚠️ Signature non vérifiée:", e)
        return HttpResponse(status=400)

    print("✅ Event reçu:", event["type"])  # ← Affiche le type d'événement

    # Quand un paiement est terminé
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        print("🧾 Session reçue :", session)  # ← Ajoute ça

        stripe_session_id = session.get('id')
        print("🔍 Recherche Order avec stripe_checkout_id =", stripe_session_id)

        try:
            order = Order.objects.get(stripe_checkout_id=stripe_session_id)
            order.payment_status = 'paid'
            order.save()
            print("✅ Commande mise à jour:", order.id)
        except Order.DoesNotExist:
            # pass  # ignore ou log
            print("❌ Aucune commande trouvée avec cet ID")

    return HttpResponse(status=200)
