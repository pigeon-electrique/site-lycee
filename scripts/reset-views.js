const { MongoClient } = require('mongodb')

async function resetViews() {
  const uri = 'mongodb://localhost:27017/recettes-fr'

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db('recettes-fr')

    // Supprimer toutes les vues existantes
    await db.collection('recipe_views').deleteMany({})

    // Récupérer toutes les recettes
    const recipes = await db.collection('recipes').find().toArray()

    // Pour chaque recette, créer un nombre aléatoire de vues entre 0 et 10
    const viewsToInsert = recipes.flatMap(recipe => {
      const viewCount = Math.floor(Math.random() * 11) // 0 à 10 vues
      return Array.from({ length: viewCount }, () => ({
        recipeId: recipe._id,
        userId: null, // vues anonymes
        viewedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // vue dans les 30 derniers jours
      }))
    })

    if (viewsToInsert.length > 0) {
      await db.collection('recipe_views').insertMany(viewsToInsert)
    }

    // Mettre à jour le compteur de vues dans chaque recette
    for (const recipe of recipes) {
      const viewCount = await db.collection('recipe_views').countDocuments({ recipeId: recipe._id })
      await db.collection('recipes').updateOne(
        { _id: recipe._id },
        { $set: { views: viewCount } }
      )
    }

    console.log('Vues réinitialisées avec succès')
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des vues:', error)
  } finally {
    await client.close()
  }
}

resetViews().catch(console.error)
