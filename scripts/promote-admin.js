const { MongoClient } = require('mongodb');

async function promoteToAdmin() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Promotion d\'un utilisateur en admin...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Promouvoir evezard.gaspard@gmail.com en admin
    const result = await db.collection('users').updateOne(
      { email: 'evezard.gaspard@gmail.com' },
      { $set: { role: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log('❌ Utilisateur non trouvé');
    } else if (result.modifiedCount === 0) {
      console.log('⚠️ L\'utilisateur est déjà admin');
    } else {
      console.log('✅ Utilisateur promu en admin !');
    }
    
    // Vérifier le changement
    const user = await db.collection('users').findOne({ 
      email: 'evezard.gaspard@gmail.com' 
    });
    
    if (user) {
      console.log('👤 Utilisateur mis à jour:');
      console.log(`   Nom: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle: ${user.role}`);
    }
    
    await client.close();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

promoteToAdmin();
