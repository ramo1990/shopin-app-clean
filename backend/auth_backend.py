from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class InactiveUserBackend(ModelBackend):
    """
    Permet d'authentifier un utilisateur même s'il n'est pas actif.
    Utilisé uniquement pour des actions comme le renvoi de lien d'activation.
    """
    def user_can_authenticate(self, user):
        return True  # <- contourne la vérification is_active
