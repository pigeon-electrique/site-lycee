import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({
        recipes: [],
        pagination: { page, limit, total: 0, pages: 0 }
      })
    }
    const db = client.db('recettes-fr')

    // Récupérer les favoris de l'utilisateur avec les détails des recettes
    const favorites = await db.collection('user_favorites').aggregate([
      {
        $match: { userId: session.user.id }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipeId',
          foreignField: 'id',
          as: 'recipe'
        }
      },
      {
        $unwind: '$recipe'
      },
      {
        $match: { 'recipe.isPublished': true }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $project: {
          recipe: 1,
          createdAt: 1
        }
      }
    ]).toArray()

    // Compter le total
    const total = await db.collection('user_favorites').countDocuments({
      userId: session.user.id
    })

    const recipes = favorites.map(fav => ({
      ...fav.recipe,
      likes: fav.recipe.likes || 0
    }))

    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}