import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ liked: false, favorited: false })
    }

    const recipeId = params.id
    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ liked: false, favorited: false })
    }
    const db = client.db('recettes-fr')

    // Vérifier si l'utilisateur a liké cette recette
    const existingLike = await db.collection('recipe_likes').findOne({
      recipeId: recipeId,
      userId: session.user.id
    })

    // Vérifier si l'utilisateur a cette recette en favori
    const existingFavorite = await db.collection('user_favorites').findOne({
      recipeId: recipeId,
      userId: session.user.id
    })

    return NextResponse.json({
      liked: !!existingLike,
      favorited: !!existingFavorite
    })

  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error)
    return NextResponse.json({ liked: false, favorited: false })
  }
}