# 🔐 Configuration de l'Authentification Réelle

## 📋 **Étapes de Configuration**

### **1. Configuration Google OAuth**

#### **A. Créer un projet Google Cloud**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Identity

#### **B. Configurer OAuth 2.0**
1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choisissez "Web application"
4. Configurez les URLs autorisées :
   - **Authorized JavaScript origins** : `http://localhost:3001`
   - **Authorized redirect URIs** : `http://localhost:3001/api/auth/callback/google`

#### **C. Récupérer les clés**
1. Copiez le **Client ID** et **Client Secret**
2. Mettez à jour votre fichier `.env.local` :

```env
GOOGLE_CLIENT_ID=votre-vrai-client-id-ici
GOOGLE_CLIENT_SECRET=votre-vrai-client-secret-ici
```

### **2. Configuration MongoDB**

#### **Option A : MongoDB Local**
1. Installez MongoDB sur votre machine
2. Démarrez le service MongoDB
3. Votre URI est déjà configurée : `mongodb://localhost:27017/patisserie`

#### **Option B : MongoDB Atlas (Recommandé)**
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit
3. Créez un utilisateur de base de données
4. Obtenez l'URI de connexion
5. Mettez à jour votre fichier `.env.local` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/patisserie
```

### **3. Configuration NextAuth**

Mettez à jour votre fichier `.env.local` avec une vraie clé secrète :

```env
NEXTAUTH_SECRET=votre-clé-secrète-très-longue-et-sécurisée-ici
```

**Générateur de clé secrète :**
```bash
openssl rand -base64 32
```

## 🚀 **Test de l'Authentification**

1. **Démarrez le serveur** : `npm run dev`
2. **Accédez au site** : `http://localhost:3001`
3. **Cliquez sur "Se connecter"**
4. **Choisissez Google** et connectez-vous
5. **Devenez admin** : Le premier utilisateur peut devenir administrateur

## 🔧 **Fonctionnalités Activées**

### **Pour les Utilisateurs**
- ✅ Connexion Google OAuth
- ✅ Profil utilisateur
- ✅ Accès aux recettes
- ✅ Interface de cuisson

### **Pour les Administrateurs**
- ✅ Dashboard admin complet
- ✅ Gestion des recettes
- ✅ Gestion des utilisateurs
- ✅ Statistiques en temps réel

## 🛠️ **Dépannage**

### **Erreur "Invalid client"**
- Vérifiez que vos clés Google sont correctes
- Vérifiez que l'URL de redirection est exacte

### **Erreur MongoDB**
- Vérifiez que MongoDB est démarré (local)
- Vérifiez l'URI de connexion (Atlas)

### **Erreur NextAuth**
- Vérifiez que `NEXTAUTH_URL` correspond à votre port
- Vérifiez que `NEXTAUTH_SECRET` est défini

## 📱 **URLs de Production**

Pour la production, mettez à jour :
- `NEXTAUTH_URL` : Votre domaine de production
- URLs Google OAuth : Votre domaine de production
- `MONGODB_URI` : Votre base de données de production

---

**🎉 Une fois configuré, votre site aura une authentification complète et sécurisée !**
