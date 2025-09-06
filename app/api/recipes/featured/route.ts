import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    if (!client) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      )
    }
    const db = client.db()

    // Récupère toutes les recettes, triées par vues
    let topRecipes = await db.collection('recipes')
      .find({
        // Si une recette n'a pas de champ published, on la considère comme publiée
        $or: [
          { published: true },
          { published: { $exists: false } }
        ]
      })
      .project({
        _id: 1,
        title: 1,
        description: 1,
        image: 1,
        author: 1,
        category: 1,
        views: 1,
        difficulty: 1,
        preparationTime: 1,
        createdAt: 1
      })
      // Trie par nombre de vues décroissant, si views n'existe pas, utilise 0
      .sort({ views: -1 })
      .limit(3)
      .toArray()

    // Si certaines recettes n'ont pas de vues, initialise à 0
    topRecipes = topRecipes.map(recipe => ({
      ...recipe,
      views: recipe.views || 0,
      difficulty: recipe.difficulty || 'facile',
      preparationTime: recipe.preparationTime || 30
    }))

    return NextResponse.json(topRecipes)
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes populaires:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
