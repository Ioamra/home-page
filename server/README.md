# Utilisation

# Configuration

Installer <a href="https://www.pgadmin.org/download/">pgAdmin</a>, lancez-le et créez une base de donnée `api-vetosphere`

### Dans `/api` créer un fichier `.env` avec :

- `DEV_MODE` permet de rediriger les mail vers `MAIL_DEV`

- `DEBUG_MODE` permet d'avoir des retours d'erreur plus explicite

- `GENERATE_POSTMAN_COLLECTION` rallenti le lancement du serveur, peut etre modifier au besoin.

`````
# Api
PORT = 3500
DEV_MODE = 'true'
MAIL_DEV ='exemple@gmail.com'
DEBUG_MODE = 'true'
GENERATE_POSTMAN_COLLECTION = 'true'

# Database
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'
DB_NAME = 'api-vetosphere'

# Cors
CORS_ORIGIN = 'http://localhost:4200'

# Frontend
FRONT_URL = 'http://localhost:4200'

# Encrypt password
SALT_ENCRYPT = 'fif1ezj jfe zj86641 wffz5fz1fk7enzknfjeznjfn znfj eznj2kn fjenjfbjzozfef15e1 fe5151579ehh6c5 fez2fez5f5464huy5iknbbccops45 5 dg5f4 g5 4d5g4 5d4g 54d3f'
PASSWORD_ENCRYPT = 'mon cµl $ur l@ comode de ta m£re!'
IV_ENCRYPT = '2PuK3tNygkLuXUUXLHlDCw=='

# JWT
JWT_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----'
JWT_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAhViBDCTKcsjh+W4a6F+T
PZ2DoF76Ojo908QMOJL0g0+D1fJ3QvmjymoqBUEMDg3NtsRRxO2pKlui+r7+zp8o
yg+6+aJcpnjwTcikoLWZQK7mLPHnJmUkhLRJbvfgoDxHQ7+7QI8Xghg6QMfx4IOg
x41KUphmgv4oLKO7grnUFsFYcx4C2Fii00W7oW1vjcwP6242M+vSHrckejSjZLkW
FTiYK/xd8gomYZ3i8o2oR9cZFU68zqEkGzm2uzowNgSRxAUmE8apPEzEWDwjD3sj
y7t310pQv2T2KpgQ2QmjhQZzexJziCn0022giPc0hZlUTiSdAROMercZZranSI2s
7KitfolvjsvYhrj1yT2Xg45FO7+HefEZfW2CzAFYMlp+HXl+NtXd6lDsRGUHdFo7
BfzfsmWMwmmmyVKKLUmjMRfG4n4iO+dDbjtM/0PiTi9NAU5BpvZjwrNtqjW2XhQQ
fSPwDkHhsFHqZY1+eIZOebTKrKbX51Fgm32nphODuL3/5ReO16r7Isel/eMKlIpP
Zsi4tScbGm6WAFiFw8wQHBxvhIZju4oRPnNFzAKbFk6SZwNrqmbbzjIwn9Qda41p
axky9t0Z9QyCozKUfNeI6pak64ljI25xTiQovX4WrM98NPVPHsBAmM0In+F+M0ui
8WDWnjrUU1sdhjFyBAh+3C8CAwEAAQ==
-----END PUBLIC KEY-----
'
JWT_ALGORITHM = 'RS256'
JWT_EXPIRES_IN = '1200000'

# Cookie
COOKIE_SECRET = 'KO7grnUFsFYcx4C2Fii00W7oW1vjcwP6242M+vSHrckejSjZLkW'
COOKIE_SECURE = 'false'
COOKIE_DOMAIN = 'localhost'
COOKIE_HTTP_ONLY = 'true'
COOKIE_PATH = '/'

# Info nodemailer
SMTP_MAILER='smtp.gmail.com'
SMTP_PORT=587
SECURE_MAILER='false'
USER_MAILER='imaudio.service13@gmail.com'
PASS_MAILER='mhub wuwq tnlj wdxb'

# Default user photo
DEFAULT_CLIENT_PHOTO='default-client.png'
DEFAULT_VETERINARIAN_PHOTO='default-veterinarian.png'
````markdown
# Serveur (API NestJS)

Ce projet utilise [NestJS](https://nestjs.com/) pour l'API.

## Prérequis

- Node.js (v18+ recommandé)
- PostgreSQL

## Installation

Installe les dépendances :

```bash
npm install
`````

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

## Tests

Lance les tests unitaires :

```bash
npm test
```

## Documentation

Pour plus d'informations sur NestJS, consulte

```

```
