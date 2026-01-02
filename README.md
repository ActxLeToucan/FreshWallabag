# FreshWallabag
Synchronisation des articles lus FreshRSS -> Wallabag.

Les articles lus dans FreshRSS parmi les flux générés par Wallabag sont marqués comme lus dans Wallabag.

## Développement
### Configuration de l'environnement
Dupliquer le fichier [`.env.dist`](.env.dist) en `.env`.\
Renseigner les variables d'environnement manquantes.

### Installation du projet en local
Installer les dépendances du projet
```npm ci```

### Lancement du projet
Exécuter la commande ```npm run dev```.\
L'application va tourner en mode watch.

## Déploiement
### Build simple
Exécuter la commande ```npm run build``` pour générer le build de l'application.\
Pour lancer le serveur, exécutez la commande ```npm start```.

### Docker
Créer un fichier `docker-compose.yml` à partir de [`docker-compose.yml.dist`](docker-compose.yml.dist).\
Le modifier si besoin pour obtenir la configuration souhaitée.

Exécuter la commande ```docker compose up -d``` pour lancer l'image docker de l'application.
