const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Test de connexion MongoDB...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    // Lister les bases de données
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('📊 Bases de données disponibles:', dbs.databases.map(db => db.name));
    
    // Tester la base de données recettes-fr
    const db = client.db('recettes-fr');
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections dans recettes-fr:', collections.map(col => col.name));
    
    await client.close();
    console.log('🔌 Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.log('\n💡 Solutions possibles:');
    console.log('1. Vérifiez que MongoDB est démarré: mongod');
    console.log('2. Vérifiez l\'URI dans .env.local');
    console.log('3. Vérifiez que le port 27017 est libre');
  }
}

testConnection();
