<section style="max-width: 768px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; align-items: center;">

<h1 style="text-align: center; font-size: 3.5em; max-width: 500px; margin: 0 auto;">Apocal'IPSSI 2025</h1>

<h1 style="text-align: center; font-size: 2em; max-width: 500px; margin: 0 auto;">Proof Of Concept : 
Assistant intelligent de synthèse de documents
</h1>

<article style="display: flex; flex-direction: column; gap: 6px">
<h2 style="text-align: center; font-size: 1.5em; max-width: 500px; margin: 0 auto;">Groupe 12</h2>

<ul style="margin-top: 6px">
<li>BOUTTIER Yanis</li>
<li>CAPEL Jules</li>
<li>GAMY Stive</li>
<li>LASSOUED Saddem</li>
<li>LAU Tom</li>
<li>TCHINDA DOUANLA Stevie Carole</li>
</ul>
</article>

</section>

<br>
<br>
<br>

## 📋 Description du projet

Ce projet est un assistant intelligent de synthèse de documents développé dans le cadre de l'Apocal'IPSSI 2025. L'application permet aux utilisateurs de télécharger des documents (PDF, texte) et d'obtenir des résumés intelligents générés par IA.

### 🚀 Fonctionnalités principales

- **Authentification utilisateur** : Système de connexion et d'inscription sécurisé
- **Upload de documents** : Support pour les fichiers PDF et texte
- **Synthèse intelligente** : Génération automatique de résumés via IA
- **Interface moderne** : Interface utilisateur intuitive et responsive
- **API REST** : Backend robuste avec gestion d'erreurs

### 🛠️ Technologies utilisées

**Frontend :**

- React 18 avec TypeScript
- Vite pour le build
- Tailwind CSS pour le styling
- Shadcn/ui pour les composants
- React Router pour la navigation

**Backend :**

- Node.js avec Express
- TypeScript
- MongoDB avec Mongoose
- JWT pour l'authentification
- Multer pour la gestion des fichiers
- Hugging Face API pour l'IA

## 🚀 Installation et utilisation

### Prérequis

- Docker et Docker Compose installés
- Git

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/apocalipssi-grp-12.git
cd apocalipssi-grp-12
```

### 2. Configuration

**Variables d'environnement** : Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
MONGODB_URI=mongodb://localhost:27017/apocalipssi
JWT_SECRET=votre_secret_jwt_super_securise
HUGGING_FACE_API_KEY=votre_cle_api_hugging_face
PORT=3001
```

### 3. Lancement de l'application avec Docker

Pour lancer l'ensemble du projet (frontend, backend et base de données) :

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Cette commande va :

- Construire les images Docker pour le frontend et le backend
- Démarrer MongoDB
- Lancer tous les services

L'application sera accessible sur :

- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

### Alternative : Installation manuelle (sans Docker)

Si vous préférez installer manuellement :

**Prérequis :**

- Node.js (version 18 ou supérieure)
- npm ou pnpm
- MongoDB installé et configuré

**Installation des dépendances :**

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

**Lancement manuel :**

```bash
# Backend (dans un terminal)
cd server
npm run dev

# Frontend (dans un autre terminal)
npm run dev
```

## 📁 Structure du projet

```
apocalipssi-grp-12/
├── src/                    # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── lib/               # Utilitaires et configurations
│   └── assets/            # Ressources statiques
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── models/        # Modèles MongoDB
│   │   ├── middleware/    # Middlewares Express
│   │   └── lib/           # Utilitaires backend
│   └── package.json
└── README.md
```

## 🔧 Scripts disponibles

**Frontend :**

- `npm run dev` : Lance le serveur de développement

**Backend :**

- `npm run dev` : Lance le serveur avec nodemon
