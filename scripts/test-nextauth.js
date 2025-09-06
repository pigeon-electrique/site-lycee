const { MongoClient } = require('mongodb');

async function testNextAuth() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Test NextAuth avec MongoDB...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Vérifier les collections NextAuth
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections disponibles:', collections.map(col => col.name));
    
    // Vérifier les utilisateurs
    const users = await db.collection('users').find({}).toArray();
    console.log('👥 Utilisateurs:', users.length);
    if (users.length > 0) {
      console.log('   Premier utilisateur:', {
        id: users[0]._id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      });
    }
    
    // Vérifier les sessions
    const sessions = await db.collection('sessions').find({}).toArray();
    console.log('🔐 Sessions:', sessions.length);
    
    // Vérifier les comptes
    const accounts = await db.collection('accounts').find({}).toArray();
    console.log('🔑 Comptes:', accounts.length);
    
    await client.close();
    console.log('✅ Test NextAuth terminé');
    
  } catch (error) {
    console.error('❌ Erreur NextAuth:', error.message);
  }
}

testNextAuth();
