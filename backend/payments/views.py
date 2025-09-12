from django.shortcuts import render
from orders.models import Order
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from cart.models import CartItem


# mode de paiement
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        # 1. Lecture des frais de livraison
        delivery_cost = request.data.get("delivery_cost", 0)
        try:
            delivery_cost = float(delivery_cost)
        except (ValueError, TypeError):
            delivery_cost = 0

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Commande non trouvée"}, status=status.HTTP_404_NOT_FOUND)

        # 2. Calcul du montant total à payer (commande + livraison)
        total_amount = float(order.total) + delivery_cost
        print(f"🧾 Montant total à payer (commande + livraison) : {total_amount} FCFA")

        # 3. URLs de redirection
        success_url = f'{settings.FRONTEND_URL}/confirmation/{order.id}'
        cancel_url = f'{settings.FRONTEND_URL}/cancel'
        print("🔙 cancel_url:", cancel_url)
        # cancel_url = request.build_absolute_uri(f'/payment/{order.id}')

        # ✅ METTRE À JOUR LE STATUT À 'pending'
        order.status = 'pending'
        order.save()

        # 4. creation de la section stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'xof',
                    'unit_amount': int(total_amount),  # en centimes
                    'product_data': {'name': f'Commande #{order.id}'},
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
        )

        # 5. Sauvegarde de l'ID de la session
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

    print("✅ Event reçu:", event["type"])

    # Quand un paiement est terminé
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        print("🧾 Session reçue :", session)

        stripe_session_id = session.get('id')
        print("🔍 Recherche Order avec stripe_checkout_id =", stripe_session_id)

        try:
            order = Order.objects.get(stripe_checkout_id=stripe_session_id)
            order.payment_status = 'paid'
            order.status = 'paid'
            order.save()
            print("✅ Commande mise à jour:", order.id)

            # Suppression du panier
            print("Suppression du panier de l'utilisateur:", order.user.email)
            CartItem.objects.filter(user=order.user).delete()
            print('Panier supprimé')
        except Order.DoesNotExist:
            print("❌ Aucune commande trouvée avec cet ID")

    return HttpResponse(status=200)
