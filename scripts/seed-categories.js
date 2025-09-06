const { MongoClient } = require('mongodb');

async function seedCategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🏷️ Ajout des catégories par défaut...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Créer les catégories par défaut
    console.log('🏷️ Création des catégories...');
    const categories = [
      {
        id: 'category_genoises',
        name: 'Génoises',
        description: 'Biscuits légers et aérés, base de nombreux gâteaux',
        color: '#3B82F6',
        icon: 'cake',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'category_cremes',
        name: 'Crèmes',
        description: 'Crèmes pâtissières, chantilly, mousses et autres préparations crémeuses',
        color: '#EC4899',
        icon: 'chef-hat',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'category_glaces',
        name: 'Glaces',
        description: 'Glaces, sorbets et desserts glacés',
        color: '#06B6D4',
        icon: 'ice-cream',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'category_pates',
        name: 'Pâtes',
        description: 'Pâtes à choux, pâtes brisées, sablées et autres pâtes de base',
        color: '#F59E0B',
        icon: 'cookie',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'category_decors',
        name: 'Décors',
        description: 'Techniques de décoration, glaçages, pâtes d\'amande et finitions',
        color: '#8B5CF6',
        icon: 'heart',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'category_autres',
        name: 'Autres',
        description: 'Autres recettes de pâtisserie et desserts',
        color: '#10B981',
        icon: 'utensils',
        isActive: true,
        recipeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const category of categories) {
      await db.collection('categories').updateOne(
        { id: category.id },
        { $set: category },
        { upsert: true }
      );
    }
    console.log('✅ Catégories créées');

    // Vérifier les données
    const categoryCount = await db.collection('categories').countDocuments();

    console.log('\n📊 Résumé:');
    console.log(`🏷️ Catégories: ${categoryCount}`);

    // Lister les catégories
    const allCategories = await db.collection('categories').find({}).toArray();
    console.log('\n🏷️ Catégories disponibles:');
    allCategories.forEach(category => {
      console.log(`  - ${category.name} (${category.id})`);
    });

    await client.close();
    console.log('\n🎉 Catégories ajoutées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

seedCategories();
