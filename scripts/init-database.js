const { MongoClient } = require('mongodb');

async function initDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Initialisation de la base de données...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Créer des collections de base
    console.log('📁 Création des collections...');
    
    // Collection users (pour NextAuth)
    await db.createCollection('users');
    console.log('✅ Collection "users" créée');
    
    // Collection accounts (pour NextAuth)
    await db.createCollection('accounts');
    console.log('✅ Collection "accounts" créée');
    
    // Collection sessions (pour NextAuth)
    await db.createCollection('sessions');
    console.log('✅ Collection "sessions" créée');
    
    // Collection recettes (pour votre app)
    await db.createCollection('recettes');
    console.log('✅ Collection "recettes" créée');
    
    // Vérifier les collections
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections dans recettes-fr:', collections.map(col => col.name));
    
    // Insérer un document de test
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(testUser);
    console.log('✅ Utilisateur de test inséré:', result.insertedId);
    
    // Vérifier l'insertion
    const users = await db.collection('users').find({}).toArray();
    console.log('👥 Utilisateurs dans la base:', users.length);
    
    await client.close();
    console.log('🔌 Connexion fermée');
    console.log('🎉 Base de données initialisée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

initDatabase();
