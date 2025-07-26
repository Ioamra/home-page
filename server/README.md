# Utilisation

# Configuration

Installer <a href="https://www.pgadmin.org/download/">pgAdmin</a>, lancez-le et créez une base de donnée `home-page`

## Configuration

Crée un fichier `.env` dans le dossier `server` avec le contenu suivant (adapte selon tes besoins) :

```env
# Api
PORT=3500
DEV_MODE='true'
MAIL_DEV='mailprojdev@gmail.com'
GENERATE_POSTMAN_COLLECTION='true'

# Database
DB_HOST='localhost'
DB_PORT='5432'
DB_USER='postgres'
DB_PASSWORD='postgres'
DB_NAME='home-page'

# Cors
CORS_ORIGIN='http://localhost:4200'

# Frontend
FRONT_URL='http://localhost:4200'

# Encrypt password
SALT_ENCRYPT='votre_salt'
PASSWORD_ENCRYPT='votre_mot_de_passe_secret'
IV_ENCRYPT='votre_iv_base64'

# JWT
JWT_PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----'
JWT_PUBLIC_KEY='-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----'
JWT_ALGORITHM='RS256'
JWT_EXPIRES_IN='1200000'

# Cookie
COOKIE_SECRET='votre_cookie_secret'
COOKIE_SECURE='false'
COOKIE_DOMAIN='localhost'
COOKIE_HTTP_ONLY='true'
COOKIE_PATH='/'

# Info nodemailer
SMTP_MAILER='smtp.gmail.com'
SMTP_PORT=587
SECURE_MAILER='false'
USER_MAILER='votre_email@gmail.com'
PASS_MAILER='votre_mot_de_passe'

# Default user photo
DEFAULT_PHOTO='default-user.png'
```

## Lancement du serveur

```bash
npm run start:dev
```

L'API sera disponible sur [http://localhost:3500](http://localhost:3500).
