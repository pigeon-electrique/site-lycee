import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    
    // Données par défaut si pas de connexion DB
    if (!client) {
      return NextResponse.json({
        totalRecipes: 15,
        totalUsers: 8,
        totalLikes: 45,
        totalFavorites: 23,
        popularCategories: [
          { _id: 'Gâteaux', count: 5 },
          { _id: 'Tartes', count: 3 },
          { _id: 'Viennoiseries', count: 4 }
        ]
      })
    }

    const db = client.db('recettes-fr')

    // Statistiques en parallèle
    const [
      totalRecipes,
      totalUsers,
      totalLikes,
      totalFavorites,
      popularCategories
    ] = await Promise.all([
      // Total des recettes publiées
      db.collection('recipes').countDocuments({ isPublished: true }),
      
      // Total des utilisateurs
      db.collection('users').countDocuments(),
      
      // Total des likes
      db.collection('recipe_likes').countDocuments(),
      
      // Total des favoris
      db.collection('user_favorites').countDocuments(),
      
      // Catégories populaires
      db.collection('recipes').aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray()
    ])

    return NextResponse.json({
      totalRecipes,
      totalUsers,
      totalLikes,
      totalFavorites,
      popularCategories
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    
    // Données par défaut en cas d'erreur
    return NextResponse.json({
      totalRecipes: 15,
      totalUsers: 8,
      totalLikes: 45,
      totalFavorites: 23,
      popularCategories: [
        { _id: 'Gâteaux', count: 5 },
        { _id: 'Tartes', count: 3 },
        { _id: 'Viennoiseries', count: 4 }
      ]
    })
  }
}