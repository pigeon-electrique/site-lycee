const { MongoClient } = require('mongodb');

async function cleanTestData() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🧹 Nettoyage des données de test...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Supprimer les utilisateurs de test (garder seulement admin et evezard.gaspard@gmail.com)
    console.log('👥 Suppression des utilisateurs de test...');
    const testUsers = await db.collection('users').deleteMany({
      email: { 
        $in: [
          'test@example.com',
          'marie.dubois@lycee.fr',
          'pierre.martin@lycee.fr',
          'sophie.leroy@lycee.fr'
        ]
      }
    });
    console.log(`✅ ${testUsers.deletedCount} utilisateurs de test supprimés`);

    // Supprimer toutes les recettes de test
    console.log('🍰 Suppression des recettes de test...');
    const testRecipes = await db.collection('recipes').deleteMany({});
    console.log(`✅ ${testRecipes.deletedCount} recettes supprimées`);

    // Supprimer toutes les vues de test
    console.log('👀 Suppression des vues de test...');
    const testViews = await db.collection('recipe_views').deleteMany({});
    console.log(`✅ ${testViews.deletedCount} vues supprimées`);

    // Supprimer les notes de test
    console.log('⭐ Suppression des notes de test...');
    const testRatings = await db.collection('recipe_ratings').deleteMany({});
    console.log(`✅ ${testRatings.deletedCount} notes supprimées`);

    // Vérifier les données restantes
    const userCount = await db.collection('users').countDocuments();
    const recipeCount = await db.collection('recipes').countDocuments();
    const viewCount = await db.collection('recipe_views').countDocuments();

    console.log('\n📊 Données restantes:');
    console.log(`👥 Utilisateurs: ${userCount}`);
    console.log(`🍰 Recettes: ${recipeCount}`);
    console.log(`👀 Vues: ${viewCount}`);

    // Lister les utilisateurs restants
    const remainingUsers = await db.collection('users').find({}).toArray();
    console.log('\n👤 Utilisateurs restants:');
    remainingUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    await client.close();
    console.log('\n🎉 Nettoyage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

cleanTestData();
