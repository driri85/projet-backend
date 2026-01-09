# 📚 API Plateforme de Gestion d'Annonces

> API RESTful Node.js/Express + MariaDB pour une plateforme de publication et gestion d'annonces en ligne

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour développement local)

### Lancer l'application

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker logs app-annonces-API-nodejs -f

# Arrêter les services
docker compose down
```

### Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **API** | http://localhost:3000 | API REST principale |
| **Adminer** | http://localhost:8080 | Interface BDD (user: root, pass: root) |
| **MailHog** | http://localhost:8025 | Interface emails de test |

### Configuration de la base de données

```bash
# Exécuter les migrations
docker exec app-annonces-API-nodejs npx sequelize-cli db:migrate

# Exécuter les seeders (admin + catégories)
docker exec app-annonces-API-nodejs npx sequelize-cli db:seed:all
```

---

## 📖 Documentation API

### Structure de base

**Base URL:** `http://localhost:3000`

**Authentification:** JWT Bearer Token
```
Authorization: <votre_token_jwt>
```

---

## 🔐 Authentification

### S'inscrire
```http
POST /register
Content-Type: application/json

{
  "firstname": "Jean",
  "lastname": "Dupont",
  "username": "jean.dupont@example.com",
  "password": "SecurePass123!",
  "phone_number": "+33612345678",
  "address": "123 Rue Example",
  "zip_code": "75001",
  "city": "Paris"
}
```

**Réponse:**
```json
{
  "message": "Utilisateur créer avec succès",
  "user": {
    "id": 1,
    "firstname": "Jean",
    "lastname": "Dupont",
    "username": "jean.dupont@example.com",
    "role": "seller"
  }
}
```

### Se connecter
```http
POST /login
Content-Type: application/json

{
  "username": "contact@arsdv.site",
  "password": "MotDePasse123"
}
```

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "firstname": "Adrien",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Se déconnecter
```http
POST /logout
Authorization: <token>
```

---

## 📁 Catégories

### Lister toutes les catégories
```http
GET /categories
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Électronique",
    "description": "Appareils électroniques et informatiques",
    "slug": "electronique",
    "createdAt": "2026-01-09T08:52:22.000Z",
    "updatedAt": "2026-01-09T08:52:22.000Z"
  }
]
```

### Obtenir une catégorie
```http
GET /categories/{id}
```

### [ADMIN] Créer une catégorie
```http
POST /categories
Authorization: <admin_token>
Content-Type: application/json

{
  "name": "Vélos",
  "description": "Vélos neufs et d'occasion",
  "slug": "velos"
}
```

### [ADMIN] Modifier une catégorie
```http
PUT /categories/{id}
Authorization: <admin_token>
```

### [ADMIN] Supprimer une catégorie
```http
DELETE /categories/{id}
Authorization: <admin_token>
```

---

## 📝 Annonces

### Rechercher des annonces
```http
GET /annonces?search=iPhone
```

**Paramètres:**
- `search` (optionnel): Recherche dans le titre

**Réponse:**
```json
[
  {
    "id": 1,
    "title": "iPhone 13 Pro 256Go",
    "description": "iPhone en excellent état",
    "price": 799.99,
    "status": "published",
    "category_id": 1,
    "user_id": 2,
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
]
```

### Obtenir une annonce
```http
GET /annonces/{id}
```

### Créer une annonce
```http
POST /annonces
Authorization: <token>
Content-Type: application/json

{
  "title": "iPhone 13 Pro 256Go",
  "description": "iPhone en excellent état avec boîte et accessoires",
  "price": 799.99,
  "category_id": 1,
  "status": "draft",
  "filepath": "/uploads/image.jpg"
}
```

**Réponse:**
```json
{
  "status": "Annonce créer avec succès",
  "annonce": {
    "id": 1,
    "title": "iPhone 13 Pro 256Go",
    "price": 799.99
  },
  "mail_notification": {}
}
```

### Modifier une annonce
```http
PUT /annonces/{id}
Content-Type: application/json

{
  "title": "iPhone 13 Pro 256Go - Prix négociable",
  "price": 749.99,
  "status": "published"
}
```

### Supprimer une annonce
```http
DELETE /annonces/{id}
```

### [ADMIN] Lister toutes les annonces
```http
GET /annonces/all
Authorization: <admin_token>
```

---

## 🚨 Signalements

### Signaler une annonce (public)
```http
POST /signalements
Content-Type: application/json

{
  "annonce_id": 5,
  "email": "reporter@example.com",
  "message": "Cette annonce contient des informations trompeuses"
}
```

**Réponse:**
```json
{
  "id": 1,
  "annonce_id": 5,
  "email": "reporter@example.com",
  "message": "Cette annonce contient des informations trompeuses",
  "status": "new",
  "createdAt": "2026-01-09T10:00:00.000Z"
}
```

### [ADMIN] Lister les signalements
```http
GET /signalements
Authorization: <admin_token>
```

### [ADMIN] Traiter un signalement
```http
PATCH /signalements/{id}
Authorization: <admin_token>
Content-Type: application/json

{
  "status": "processed",
  "response": "Nous avons pris les mesures nécessaires"
}
```

---

## 💬 Commentaires Administrateurs

### [ADMIN] Lister les commentaires d'une annonce
```http
GET /admin-comments/{annonceId}
Authorization: <admin_token>
```

**Réponse:**
```json
[
  {
    "id": 1,
    "annonce_id": 5,
    "admin_id": 1,
    "comment": "Annonce mise en attente pour vérification",
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
]
```

### [ADMIN] Ajouter un commentaire
```http
POST /admin-comments
Authorization: <admin_token>
Content-Type: application/json

{
  "annonce_id": 5,
  "comment": "Annonce approuvée après vérification"
}
```

---

## 🖼️ Images d'Annonces

### Lister les images d'une annonce
```http
GET /images/{annonceId}
```

**Réponse:**
```json
[
  {
    "id": 1,
    "annonce_id": 5,
    "url": "https://example.com/image1.jpg",
    "ordering": 0,
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
]
```

### [ADMIN] Ajouter une image
```http
POST /images
Authorization: <admin_token>
Content-Type: application/json

{
  "annonce_id": 5,
  "url": "https://example.com/image2.jpg",
  "ordering": 1
}
```

### [ADMIN] Supprimer une image
```http
DELETE /images/{id}
Authorization: <admin_token>
```

---

## 🗄️ Base de Données

### Modèle de données

**Tables:**
- `Users` - Comptes utilisateurs (admin, seller)
- `Annonces` - Annonces publiées
- `Categories` - Catégories d'annonces
- `Signalements` - Signalements d'annonces problématiques
- `AdminComments` - Commentaires des administrateurs
- `ImageAnnonces` - Images multiples par annonce
- `SequelizeMeta` - Historique des migrations

**Relations:**
- Une annonce appartient à un utilisateur et une catégorie
- Une annonce peut avoir plusieurs images, commentaires admin et signalements
- Un signalement et commentaire admin appartiennent à une annonce

### Migrations et Seeders

```bash
# Créer une nouvelle migration
docker exec app-annonces-API-nodejs npx sequelize-cli migration:generate --name nom-migration

# Annuler la dernière migration
docker exec app-annonces-API-nodejs npx sequelize-cli db:migrate:undo

# Créer un seeder
docker exec app-annonces-API-nodejs npx sequelize-cli seed:generate --name nom-seeder

# Annuler tous les seeders
docker exec app-annonces-API-nodejs npx sequelize-cli db:seed:undo:all
```

---

## 🧪 Tests

### Tester avec curl

```bash
# Test endpoint home
curl http://localhost:3000/home

# Lister les catégories
curl http://localhost:3000/categories

# Créer un signalement
curl -X POST http://localhost:3000/signalements \
  -H "Content-Type: application/json" \
  -d '{
    "annonce_id": 1,
    "email": "test@example.com",
    "message": "Contenu inapproprié"
  }'
```

### Compte admin par défaut

**Username:** `contact@arsdv.site`  
**Password:** `MotDePasse123`

```bash
# Se connecter en tant qu'admin
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "contact@arsdv.site",
    "password": "MotDePasse123"
  }'
```

---

## 📊 Codes de Réponse HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Erreur de validation |
| 401 | Non authentifié |
| 403 | Accès refusé (droits insuffisants) |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: slug déjà existant) |
| 500 | Erreur serveur |

---

## 🛠️ Structure du Projet

```
projet-backend/
├── app-annonces/
│   ├── config/
│   │   └── config.json           # Config Sequelize
│   ├── src/
│   │   ├── app.js                # Point d'entrée Express
│   │   ├── middlewares/          # Middlewares (auth, validation)
│   │   ├── migrations/           # Migrations BDD
│   │   ├── models/               # Modèles Sequelize
│   │   ├── routes/               # Routes API
│   │   ├── seeders/              # Données initiales
│   │   ├── services/             # Logique métier
│   │   └── utils/                # Utilitaires (mailer)
│   ├── .env                      # Variables d'environnement
│   ├── .sequelizerc              # Config Sequelize CLI
│   └── package.json
├── db-data/                      # Données MariaDB (volume)
├── docs/
│   ├── swagger.yaml              # Documentation OpenAPI
│   ├── schema-database.sql       # Script SQL complet
│   └── README.md                 # Ce fichier
├── docker-compose.yml
└── Dockerfile
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
PORT=3000
MARIADB_HOST=db
MARIADB_PORT=3306
MARIADB_USERNAME=root
MARIADB_PASSWORD=root
MARIADB_DATABASE=monannonce
SECRET_KEY=your_jwt_secret_key
SALT=10
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_ADMIN=admin@plateforme.com
```

---

## 📦 Technologies

- **Runtime:** Node.js 24.x
- **Framework:** Express 5.x
- **ORM:** Sequelize 6.x
- **Base de données:** MariaDB 11.x
- **Authentification:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Email:** Nodemailer + MailHog
- **Conteneurisation:** Docker + Docker Compose

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT © 2026 Adrien RANDONNET

---

## 📞 Support

Pour toute question ou problème:
- Email: contact@arsdv.site
- Ouvrir une issue sur GitHub
