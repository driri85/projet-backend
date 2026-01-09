# Schéma Relationnel - Plateforme de Gestion d'Annonces

## Vue d'ensemble

Ce document présente la structure de la base de données pour la plateforme de gestion d'annonces.

## Diagramme Entité-Relation (format texte)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ PK id           │
│    email        │◄───────┐
│    password     │        │
│    nom          │        │
│    prenom       │        │
│    telephone    │        │
│    role         │        │
│    date_creation│        │
│    actif        │        │
└─────────────────┘        │
         │                 │
         │ 1               │
         │                 │
         │ N               │
         ▼                 │
┌─────────────────┐        │
│    ANNONCES     │        │
├─────────────────┤        │
│ PK id           │        │
│    titre        │        │
│    description  │        │
│    prix         │        │
│ FK user_id      │────────┘
│ FK categorie_id │────────┐
│    statut       │        │
│    date_creation│        │
│    nombre_vues  │        │
└─────────────────┘        │
         │                 │
         │                 │ 1
         │ 1               │
         │                 │ N
         │ N               ▼
         ▼          ┌─────────────────┐
┌─────────────────┐ │   CATEGORIES    │
│  SIGNALEMENTS   │ ├─────────────────┤
├─────────────────┤ │ PK id           │
│ PK id           │ │    nom          │
│ FK annonce_id   │ │    description  │
│    email        │ │    slug         │
│    message      │ └─────────────────┘
│    statut       │
│    date_creation│
│ FK admin_id     │
└─────────────────┘
         │
         │ 1
         │
         │ N
         ▼
┌─────────────────┐
│COMMENTAIRES_ADMIN│
├─────────────────┤
│ PK id           │
│ FK annonce_id   │
│ FK admin_id     │
│    commentaire  │
│    date_creation│
└─────────────────┘
```

## Description des tables

### 1. **USERS**
Stocke les informations des utilisateurs de la plateforme.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashé |
| nom | VARCHAR(100) | NOT NULL | Nom de famille |
| prenom | VARCHAR(100) | NOT NULL | Prénom |
| telephone | VARCHAR(20) | - | Numéro de téléphone |
| role | ENUM | NOT NULL | annonceur, administrateur, acheteur |
| date_creation | TIMESTAMP | DEFAULT NOW() | Date de création du compte |
| actif | BOOLEAN | DEFAULT TRUE | Compte actif ou non |

**Rôles possibles :**
- `annonceur` : Peut publier et gérer ses annonces
- `administrateur` : Peut modérer les annonces
- `acheteur` : Peut consulter et acheter

---

### 2. **CATEGORIES**
Catégorise les annonces par thématique.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| nom | VARCHAR(100) | NOT NULL | Nom de la catégorie |
| description | TEXT | - | Description de la catégorie |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |

**Catégories par défaut :** Électronique, Mobilier, Vêtements, Véhicules, Immobilier, Loisirs, Services, Autres

---

### 3. **ANNONCES**
Contient toutes les annonces publiées.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| titre | VARCHAR(255) | NOT NULL | Titre de l'annonce |
| description | TEXT | NOT NULL | Description détaillée |
| prix | DECIMAL(10,2) | NOT NULL | Prix en euros |
| user_id | INT | FK → users(id) | Propriétaire de l'annonce |
| categorie_id | INT | FK → categories(id) | Catégorie de l'annonce |
| statut | ENUM | NOT NULL | visible, non-visible, en-attente, archivee |
| date_creation | TIMESTAMP | DEFAULT NOW() | Date de création |
| date_publication | TIMESTAMP | NULLABLE | Date de publication effective |
| nombre_vues | INT | DEFAULT 0 | Compteur de vues |

**Statuts possibles :**
- `visible` : Annonce publiée et consultable par tous
- `non-visible` : Annonce masquée par l'administrateur
- `en-attente` : Annonce en attente de validation
- `archivee` : Annonce archivée (vendue ou expirée)

---

### 4. **COMMENTAIRES_ADMIN**
Commentaires des administrateurs sur les annonces.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| annonce_id | INT | FK → annonces(id) | Annonce concernée |
| admin_id | INT | FK → users(id) | Administrateur auteur |
| commentaire | TEXT | NOT NULL | Contenu du commentaire |
| date_creation | TIMESTAMP | DEFAULT NOW() | Date du commentaire |

**Usage :** Permet à l'administrateur de justifier un changement de statut ou de communiquer avec l'annonceur.

---

### 5. **SIGNALEMENTS**
Signalements d'annonces problématiques.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| annonce_id | INT | FK → annonces(id) | Annonce signalée |
| email | VARCHAR(255) | NOT NULL | Email du signalant |
| message | TEXT | NOT NULL | Motif du signalement |
| statut | ENUM | NOT NULL | nouveau, en-cours, traite, rejete |
| date_creation | TIMESTAMP | DEFAULT NOW() | Date du signalement |
| date_traitement | TIMESTAMP | NULLABLE | Date de traitement |
| admin_id | INT | FK → users(id) | Administrateur traitant |
| reponse | TEXT | - | Réponse de l'administrateur |

**Statuts possibles :**
- `nouveau` : Signalement non traité
- `en-cours` : En cours de traitement
- `traite` : Signalement traité et résolu
- `rejete` : Signalement non fondé

---

### 6. **IMAGES_ANNONCES** (optionnelle)
Stocke les images associées aux annonces.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | Identifiant unique |
| annonce_id | INT | FK → annonces(id) | Annonce concernée |
| url | VARCHAR(500) | NOT NULL | URL de l'image |
| ordre | INT | DEFAULT 0 | Ordre d'affichage |
| date_creation | TIMESTAMP | DEFAULT NOW() | Date d'ajout |

---

## Relations principales

1. **USERS ↔ ANNONCES** : Un utilisateur peut publier plusieurs annonces (1:N)
2. **CATEGORIES ↔ ANNONCES** : Une catégorie peut contenir plusieurs annonces (1:N)
3. **ANNONCES ↔ SIGNALEMENTS** : Une annonce peut avoir plusieurs signalements (1:N)
4. **ANNONCES ↔ COMMENTAIRES_ADMIN** : Une annonce peut avoir plusieurs commentaires admin (1:N)
5. **USERS ↔ COMMENTAIRES_ADMIN** : Un administrateur peut laisser plusieurs commentaires (1:N)
6. **ANNONCES ↔ IMAGES_ANNONCES** : Une annonce peut avoir plusieurs images (1:N)

---

## Index de performance

- `users(email)` : Recherche rapide lors de la connexion
- `annonces(user_id, statut, date_publication)` : Filtrage et affichage des annonces
- `annonces FULLTEXT(titre, description)` : Recherche textuelle rapide
- `signalements(statut, date_creation)` : Gestion des signalements

---

## Contraintes de sécurité

1. **Cascade de suppression** :
   - La suppression d'un utilisateur supprime ses annonces
   - La suppression d'une annonce supprime ses signalements et commentaires

2. **Restriction de suppression** :
   - Impossible de supprimer une catégorie contenant des annonces

3. **SET NULL** :
   - Si un admin est supprimé, ses signalements restent mais admin_id = NULL

---

## Évolutions futures possibles

- Table de **favoris** (users_favoris)
- Table de **messages** entre utilisateurs
- Table d'**historique des transactions**
- Table de **notations/avis**
- Système de **géolocalisation** des annonces
- Table de **notifications**
