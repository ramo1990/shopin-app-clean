import os
from pathlib import Path
from dotenv import load_dotenv
from corsheaders.defaults import default_headers
import environ
import dj_database_url
from datetime import timedelta


# Creer user
AUTH_USER_MODEL = 'accounts.CustomUser'

# Charger le fichier .env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Accès aux variables
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
# DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    'shopin-hfc7.onrender.com',]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_extensions',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'dj_rest_auth',
    'products',
    'accounts',
    'cart',
    'orders',
    'payments',
    'core',
    'customAdmin',
    'tags',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    # ajouter d'autres domaines si besoin
]


CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://shopin-three.vercel.app",  # ton frontend Vercel
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'Authorization',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


ROOT_URLCONF = 'shopin.urls'

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = os.getenv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], # ou os.path.join(BASE_DIR, 'templates')
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'shopin.wsgi.application'

FRONTEND_URL = 'http://localhost:3000'  # ou ton domaine réel si déployé

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# Initialise environ
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Definition manuelle
# DATABASES = {
#     # 'default': {
#     #     'ENGINE': 'django.db.backends.sqlite3',
#     #     'NAME': BASE_DIR / 'db.sqlite3',
#     # }
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': env('DB_NAME'),
#         'USER': env('DB_USER'),
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST'),
#         'PORT': env('DB_PORT'),
#     }
# }
DATABASES = {
    'default': dj_database_url.config(
        default=env('DATABASE_URL'),  # Assure-toi que cette variable existe dans ton .env ou sur Render
        conn_max_age=600,
        ssl_require=True  # Render nécessite SSL
    )
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Optional: cache static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Pour développement : affichage de l'e-mail dans la console
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# En prod, utiliser SMTP ou un service comme SendGrid
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')  # Ou Mailgun, Sendinblue, etc.
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587)) 
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER') # email qui recoit les message
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'

DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)
CONTACT_RECEIVER_EMAIL = os.getenv("CONTACT_RECEIVER_EMAIL", "shopin@gmail.com")  #  adresse visible par l'utilisateur


# AWS S3 BUCKET
# Variables d'environnement (ne jamais les exposer directement)
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = 'nextjs-django'
AWS_S3_SIGNATURE_NAME = 's3v4'
AWS_S3_REGION_NAME = 'eu-north-1'
AWS_S3_FILE_OVERWRITE = False
AWS_S3_VERITY = True
AWS_DEFAULT_ACL = None
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'


AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # pour l’usage normal
    'auth_backend.InactiveUserBackend',  # pour les comptes inactifs
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),   # au lieu de 5 minutes
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),      # au lieu de 1 jour
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Durée de validité des tokens de vérification (en secondes)
PASSWORD_RESET_TIMEOUT = 1800  # 30 min (à adapter pour les tests)

LOGIN_URL = 'http://localhost:3000/signin'  # ou l’URL de ta page de connexion Next.js ou ton URL de connexion en production
LOGIN_REDIRECT_URL = 'http://localhost:3000/'  # ou ta home
LOGOUT_REDIRECT_URL = 'http://localhost:3000/'

# désactiver l’auto-login après reset
DJREST_AUTH = {
    "PASSWORD_RESET_CONFIRM_RETYPE": True,  # tu peux garder ça si tu veux
    "LOGOUT_ON_PASSWORD_CHANGE": True,  # optionnel : déconnecte si déjà loggé
    "SET_PASSWORD_RETYPE": True,  # si tu utilises le endpoint "set-password"
    "PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND": True,
    "LOGIN_ON_PASSWORD_RESET": False,  # # Désactive l'auto-login après reset
}

# REST_AUTH_SERIALIZERS = {
#     "PASSWORD_RESET_SERIALIZER": "accounts.serializers.CustomPasswordResetSerializer"
# }

DJANGO_REST_AUTH = {
    "PASSWORD_RESET_CONFIRM_URL": "reset-password-confirm?uid={uid}&token={token}",
}


# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {"console": {"class": "logging.StreamHandler"}},
#     "root": {"handlers": ["console"], "level": "INFO"},
# }
