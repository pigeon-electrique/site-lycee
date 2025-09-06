import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Statistiques de base
    const totalRecipes = await db.collection('recipes').countDocuments()
    const totalUsers = await db.collection('users').countDocuments()
    const totalLikes = await db.collection('likes').countDocuments()

    // Récupérer les catégories les plus populaires
    const popularCategories = await db.collection('recipes')
      .aggregate([
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
      ]).toArray()

    // Note moyenne globale
    const ratings = await db.collection('recipes')
      .aggregate([
        { $match: { ratingCount: { $gt: 0 } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).toArray()

    const averageRating = ratings.length > 0 ? 
      Math.round(ratings[0].avgRating * 10) / 10 : 0

    return NextResponse.json({
      totalRecipes,
      totalUsers,
      totalLikes,
      popularCategories,
      averageRating
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
