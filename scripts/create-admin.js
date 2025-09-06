const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🔍 Création d\'un utilisateur admin...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Vérifier si un admin existe déjà
    const existingAdmin = await db.collection('users').findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Un admin existe déjà:', existingAdmin.email);
      await client.close();
      return;
    }
    
    // Créer l'admin
    const adminPassword = 'admin123'; // Mot de passe par défaut
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = {
      name: 'Administrateur',
      email: 'admin@patisserie.fr',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      emailVerified: null
    };
    
    const result = await db.collection('users').insertOne(admin);
    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe:', adminPassword);
    console.log('🆔 ID:', result.insertedId);
    
    // Vérifier la création
    const users = await db.collection('users').find({}).toArray();
    console.log('👥 Utilisateurs dans la base:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    await client.close();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createAdmin();
