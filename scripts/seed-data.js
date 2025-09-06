const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seedData() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recettes-fr';
  
  console.log('🌱 Ajout de données de test...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db('recettes-fr');
    
    // Créer des utilisateurs de test
    console.log('👥 Création des utilisateurs...');
    const users = [
      {
        id: 'user_1',
        name: 'Marie Dubois',
        email: 'marie.dubois@lycee.fr',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'user_2',
        name: 'Pierre Martin',
        email: 'pierre.martin@lycee.fr',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },
      {
        id: 'user_3',
        name: 'Sophie Leroy',
        email: 'sophie.leroy@lycee.fr',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
      }
    ];

    for (const user of users) {
      await db.collection('users').updateOne(
        { email: user.email },
        { $set: user },
        { upsert: true }
      );
    }
    console.log('✅ Utilisateurs créés');

    // Créer des recettes de test
    console.log('🍰 Création des recettes...');
    const recipes = [
      {
        id: 'recipe_1',
        title: 'Crème Pâtissière Vanille',
        description: 'Une crème pâtissière onctueuse et parfumée à la vanille, parfaite pour garnir vos pâtisseries.',
        content: 'Cette crème pâtissière est un classique de la pâtisserie française. Elle peut être utilisée pour garnir des éclairs, des choux, des tartes ou des gâteaux.',
        category: 'Crèmes',
        images: [],
        ingredients: [
          { id: 'ing_1', name: 'Lait entier', quantity: 500, unit: 'ml', notes: '' },
          { id: 'ing_2', name: 'Sucre', quantity: 100, unit: 'g', notes: '' },
          { id: 'ing_3', name: 'Jaunes d\'œufs', quantity: 4, unit: 'pièce', notes: '' },
          { id: 'ing_4', name: 'Maïzena', quantity: 40, unit: 'g', notes: '' },
          { id: 'ing_5', name: 'Gousse de vanille', quantity: 1, unit: 'pièce', notes: '' }
        ],
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Préparation des ingrédients',
            description: 'Fendre la gousse de vanille en deux et gratter les graines. Mélanger les jaunes d\'œufs avec le sucre et la maïzena.',
            duration: 10
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Cuisson du lait',
            description: 'Faire chauffer le lait avec la gousse de vanille jusqu\'à ébullition.',
            duration: 5
          },
          {
            id: 'step_3',
            order: 3,
            title: 'Temperage',
            description: 'Verser le lait chaud sur le mélange œufs-sucre en fouettant vigoureusement.',
            duration: 2
          },
          {
            id: 'step_4',
            order: 4,
            title: 'Cuisson de la crème',
            description: 'Remettre sur le feu et cuire en fouettant jusqu\'à épaississement.',
            duration: 8
          }
        ],
        prepTime: 15,
        cookTime: 15,
        servings: 6,
        difficulty: 'Moyen',
        author: {
          id: 'user_1',
          name: 'Marie Dubois',
          email: 'marie.dubois@lycee.fr'
        },
        tags: ['vanille', 'crème', 'pâtisserie', 'classique'],
        views: 156,
        likes: 23,
        rating: 4.8,
        ratingCount: 12,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        publishedAt: new Date('2024-01-15')
      },
      {
        id: 'recipe_2',
        title: 'Génoise Classique',
        description: 'La génoise est un biscuit léger et aéré, base de nombreux gâteaux.',
        content: 'La génoise est un biscuit de base en pâtisserie. Elle doit être légère, aérée et moelleuse.',
        category: 'Génoises',
        images: [],
        ingredients: [
          { id: 'ing_6', name: 'Œufs', quantity: 4, unit: 'pièce', notes: '' },
          { id: 'ing_7', name: 'Sucre', quantity: 120, unit: 'g', notes: '' },
          { id: 'ing_8', name: 'Farine', quantity: 120, unit: 'g', notes: '' },
          { id: 'ing_9', name: 'Beurre', quantity: 30, unit: 'g', notes: 'Fondu' }
        ],
        steps: [
          {
            id: 'step_5',
            order: 1,
            title: 'Préchauffage',
            description: 'Préchauffer le four à 180°C.',
            duration: 10
          },
          {
            id: 'step_6',
            order: 2,
            title: 'Montage des œufs',
            description: 'Battre les œufs avec le sucre au bain-marie jusqu\'à ce que le mélange soit tiède.',
            duration: 5
          },
          {
            id: 'step_7',
            order: 3,
            title: 'Fouettage',
            description: 'Fouetter à vitesse maximale jusqu\'à ce que le mélange triple de volume.',
            duration: 10
          },
          {
            id: 'step_8',
            order: 4,
            title: 'Incorporation',
            description: 'Incorporer délicatement la farine tamisée, puis le beurre fondu.',
            duration: 5
          },
          {
            id: 'step_9',
            order: 5,
            title: 'Cuisson',
            description: 'Verser dans un moule et cuire 20-25 minutes.',
            duration: 25
          }
        ],
        prepTime: 20,
        cookTime: 25,
        servings: 8,
        difficulty: 'Difficile',
        author: {
          id: 'user_2',
          name: 'Pierre Martin',
          email: 'pierre.martin@lycee.fr'
        },
        tags: ['génoise', 'biscuit', 'base', 'gâteau'],
        views: 134,
        likes: 18,
        rating: 4.6,
        ratingCount: 8,
        isPublished: true,
        isFeatured: false,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        publishedAt: new Date('2024-01-14')
      },
      {
        id: 'recipe_3',
        title: 'Glace Vanille Bourbon',
        description: 'Une glace crémeuse et parfumée à la vanille Bourbon de Madagascar.',
        content: 'Cette glace vanille est un classique indémodable. La vanille Bourbon apporte une saveur intense et délicate.',
        category: 'Glaces',
        images: [],
        ingredients: [
          { id: 'ing_10', name: 'Lait entier', quantity: 500, unit: 'ml', notes: '' },
          { id: 'ing_11', name: 'Crème liquide', quantity: 250, unit: 'ml', notes: '' },
          { id: 'ing_12', name: 'Sucre', quantity: 150, unit: 'g', notes: '' },
          { id: 'ing_13', name: 'Jaunes d\'œufs', quantity: 6, unit: 'pièce', notes: '' },
          { id: 'ing_14', name: 'Gousse de vanille Bourbon', quantity: 2, unit: 'pièce', notes: '' }
        ],
        steps: [
          {
            id: 'step_10',
            order: 1,
            title: 'Préparation de la base',
            description: 'Fendre les gousses de vanille et gratter les graines. Mélanger avec le lait et la crème.',
            duration: 10
          },
          {
            id: 'step_11',
            order: 2,
            title: 'Infusion',
            description: 'Porter à ébullition puis laisser infuser 30 minutes.',
            duration: 35
          },
          {
            id: 'step_12',
            order: 3,
            title: 'Crème anglaise',
            description: 'Fouetter les jaunes avec le sucre, puis incorporer le lait infusé.',
            duration: 15
          },
          {
            id: 'step_13',
            order: 4,
            title: 'Cuisson',
            description: 'Cuire à 85°C en remuant constamment jusqu\'à épaississement.',
            duration: 10
          },
          {
            id: 'step_14',
            order: 5,
            title: 'Refroidissement',
            description: 'Refroidir rapidement et mettre au réfrigérateur 4h minimum.',
            duration: 240
          },
          {
            id: 'step_15',
            order: 6,
            title: 'Turbinage',
            description: 'Turbiner dans une sorbetière selon les instructions.',
            duration: 30
          }
        ],
        prepTime: 20,
        cookTime: 15,
        servings: 8,
        difficulty: 'Difficile',
        author: {
          id: 'user_3',
          name: 'Sophie Leroy',
          email: 'sophie.leroy@lycee.fr'
        },
        tags: ['glace', 'vanille', 'bourbon', 'dessert'],
        views: 98,
        likes: 31,
        rating: 4.9,
        ratingCount: 15,
        isPublished: true,
        isFeatured: true,
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        publishedAt: new Date('2024-01-13')
      }
    ];

    for (const recipe of recipes) {
      await db.collection('recipes').updateOne(
        { id: recipe.id },
        { $set: recipe },
        { upsert: true }
      );
    }
    console.log('✅ Recettes créées');

    // Créer des vues de test
    console.log('👀 Création des vues...');
    const views = [];
    for (let i = 0; i < 50; i++) {
      const recipeId = recipes[Math.floor(Math.random() * recipes.length)].id;
      const userId = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)].id : null;
      
      views.push({
        id: `view_${Date.now()}_${i}`,
        recipeId,
        userId,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        viewedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    await db.collection('recipe_views').insertMany(views);
    console.log('✅ Vues créées');

    // Vérifier les données
    const userCount = await db.collection('users').countDocuments();
    const recipeCount = await db.collection('recipes').countDocuments();
    const viewCount = await db.collection('recipe_views').countDocuments();

    console.log('\n📊 Résumé des données:');
    console.log(`👥 Utilisateurs: ${userCount}`);
    console.log(`🍰 Recettes: ${recipeCount}`);
    console.log(`👀 Vues: ${viewCount}`);

    await client.close();
    console.log('\n🎉 Données de test ajoutées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

seedData();
