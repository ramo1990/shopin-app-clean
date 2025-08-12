# from datetime import datetime, timedelta
# from rest_framework_simplejwt.tokens import RefreshToken

# def generate_email_verification_token(user):
#     refresh = RefreshToken.for_user(user)
#     # Ajout d'une "aud" (audience) spécifique, par exemple 'email_verification'
#     refresh['token_type'] = 'email_verification'
#     # Tu peux aussi limiter la durée ici (par défaut refresh token à 7 jours)
#     refresh.set_exp(lifetime=timedelta(hours=24)) # Expiration du refresh token

#     access = refresh.access_token
#     access.set_exp(lifetime=timedelta(hours=24))  # Expiration de l'access token
#     return str(access)
