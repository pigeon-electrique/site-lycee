import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { DashboardStats } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Calculer les statistiques
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Statistiques de base
    const totalRecipes = await db.collection('recipes').countDocuments()
    const totalUsers = await db.collection('users').countDocuments()
    const totalViews = await db.collection('recipe_views').countDocuments()

    // Recettes cette semaine
    const recipesThisWeek = await db.collection('recipes').countDocuments({
      createdAt: { $gte: oneWeekAgo }
    })

    // Utilisateurs ce mois
    const usersThisMonth = await db.collection('users').countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })

    // Vues ce mois
    const viewsThisMonth = await db.collection('recipe_views').countDocuments({
      viewedAt: { $gte: oneMonthAgo }
    })

    // Note moyenne des recettes
    const recipesWithRating = await db.collection('recipes').aggregate([
      { $match: { ratingCount: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]).toArray()

    const averageRating = recipesWithRating.length > 0 ? recipesWithRating[0].avgRating : 0

    // Recettes populaires (par vues)
    const popularRecipes = await db.collection('recipes')
      .find({ isPublished: true })
      .sort({ views: -1 })
      .limit(3)
      .toArray()

    // Utilisateurs récents
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    // Recettes récentes
    const recentRecipes = await db.collection('recipes')
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    const stats: DashboardStats = {
      totalRecipes,
      totalUsers,
      totalViews,
      averageRating: Math.round(averageRating * 10) / 10,
      recipesThisWeek,
      usersThisMonth,
      viewsThisMonth,
      popularRecipes,
      recentUsers,
      recentRecipes
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
