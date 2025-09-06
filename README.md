# Pâtisserie Lycée - Site de Recettes

Un site web moderne pour partager et gérer les recettes de pâtisserie au lycée professionnel.

## 🍰 Fonctionnalités

### Pour les étudiants
- **Page d'accueil accueillante** avec recettes en vedette
- **Catalogue de recettes** organisé par catégories (Crémes, Génoises, Glaces, etc.)
- **Recherche avancée** avec filtres et tri
- **Interface de cuisson** étape par étape avec minuteur
- **Système de favoris** pour sauvegarder les recettes préférées
- **Thème sombre** pour un confort visuel optimal

### Pour les administrateurs
- **Dashboard complet** avec statistiques en temps réel
- **Gestion des recettes** (ajout, modification, suppression)
- **Gestion des utilisateurs** et des rôles
- **Statistiques d'utilisation** et d'engagement

### Authentification
- **Connexion Google** pour un accès rapide
- **Connexion par email** avec mot de passe
- **Gestion des rôles** (utilisateur/admin)

## 🛠️ Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes et accessibles
- **NextAuth.js** - Authentification sécurisée
- **MongoDB** - Base de données NoSQL
- **Radix UI** - Composants primitifs accessibles

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd patisserie
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créez un fichier `.env.local` à la racine du projet :
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/patisserie
# Ou pour MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/patisserie

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (optionnel)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
Rendez-vous sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
patisserie/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Pages d'authentification
│   ├── admin/             # Dashboard administrateur
│   ├── recettes/          # Pages des recettes
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants shadcn/ui
│   ├── navbar.tsx        # Barre de navigation
│   └── sidebar.tsx       # Barre latérale des catégories
├── lib/                  # Utilitaires et configuration
│   ├── auth.ts           # Configuration NextAuth
│   ├── mongodb.ts        # Connexion MongoDB
│   └── models.ts         # Types TypeScript
└── public/               # Assets statiques
```

## 🎨 Personnalisation

### Thème
Le site utilise un thème sombre par défaut. Pour modifier les couleurs, éditez le fichier `app/globals.css`.

### Composants
Tous les composants utilisent shadcn/ui et peuvent être facilement personnalisés dans le dossier `components/ui/`.

### Données
Les données sont actuellement en mode démonstration. Pour connecter une vraie base de données, modifiez les fichiers dans `lib/` et `app/api/`.

## 🔧 Configuration avancée

### MongoDB
1. Installez MongoDB localement ou utilisez MongoDB Atlas
2. Configurez l'URI de connexion dans `.env.local`
3. Les collections seront créées automatiquement

### Google OAuth
1. Créez un projet dans la Google Cloud Console
2. Activez l'API Google+
3. Créez des identifiants OAuth 2.0
4. Ajoutez les clés dans `.env.local`

### Email
1. Configurez un serveur SMTP (Gmail, SendGrid, etc.)
2. Ajoutez les paramètres dans `.env.local`

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte à tous les écrans :
- **Mobile** : Navigation hamburger, cartes empilées
- **Tablet** : Grille 2 colonnes, sidebar repliable
- **Desktop** : Grille 4 colonnes, sidebar fixe

## 🚀 Déploiement

### Vercel (recommandé)
1. Connectez votre repository GitHub à Vercel
2. Ajoutez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes
Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- Railway
- DigitalOcean
- AWS

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les issues GitHub
3. Contactez l'équipe de développement

---

**Développé avec ❤️ pour les étudiants en pâtisserie**