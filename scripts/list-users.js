const { MongoClient } = require('mongodb');

async function listUsers() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Liste des utilisateurs...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Lister tous les utilisateurs
    const users = await db.collection('users').find({}).toArray();
    console.log('👥 Utilisateurs dans la base:', users.length);
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rôle: ${user.role || 'user'}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Créé le: ${user.createdAt}`);
        console.log(`   Mot de passe: ${user.password ? 'Défini' : 'Non défini'}`);
      });
    }
    
    // Lister les sessions
    const sessions = await db.collection('sessions').find({}).toArray();
    console.log('\n🔐 Sessions actives:', sessions.length);
    
    // Lister les comptes
    const accounts = await db.collection('accounts').find({}).toArray();
    console.log('🔑 Comptes OAuth:', accounts.length);
    
    await client.close();
    console.log('\n🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

listUsers();
