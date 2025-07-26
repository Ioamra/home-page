# Home Page Personnalisée

Cette application est une page d'accueil personnalisée permettant d'ajouter plusieurs liens de sites et d'intégrer des barres de recherche personnalisées pour différents sites (Google, DuckDuckGo, YouTube, etc.), ainsi que des searchbars avec des dorks personnalisés.

## Fonctionnalités

- Ajout de liens vers des sites web favoris
- Barres de recherche personnalisées pour différents moteurs (Google, DuckDuckGo, YouTube, etc.)
- Recherche avancée avec dorks personnalisés
- Authentification et gestion utilisateur

## Installation

Clone le dépôt et installe les dépendances pour le client et le serveur :

```bash
git clone <url-du-repo>
cd home-page
cd client
npm install
cd ../server
npm install
```

## Lancement du projet

1. **Configurer la base de données**  
   Crée une base PostgreSQL (ex : `home-page`) via [pgAdmin](https://www.pgadmin.org/download/) ou autre.

2. **Configurer l'API**  
   Crée un fichier `.env` dans le dossier `server` (voir [server/README.md](server/README.md) pour un exemple).

3. **Démarrer le serveur**

   ```bash
   cd server
   npm run start:dev
   ```

4. **Démarrer le client**
   ```bash
   cd client
   npm start
   ```

Accède à l'application sur [http://localhost:4200](http://localhost:4200).
