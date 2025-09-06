import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const recipeId = params.id
    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    // Vérifier si la recette existe
    const recipe = await db.collection('recipes').findOne({ id: recipeId })
    if (!recipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 })
    }

    // Vérifier si l'utilisateur a déjà cette recette en favori
    const existingFavorite = await db.collection('user_favorites').findOne({
      recipeId: recipeId,
      userId: session.user.id
    })

    if (existingFavorite) {
      // Retirer des favoris
      await db.collection('user_favorites').deleteOne({
        recipeId: recipeId,
        userId: session.user.id
      })

      // Décrémenter le compteur de favoris de l'utilisateur
      await db.collection('users').updateOne(
        { id: session.user.id },
        { $inc: { favoritesCount: -1 } }
      )

      return NextResponse.json({ favorited: false })
    } else {
      // Ajouter aux favoris
      await db.collection('user_favorites').insertOne({
        id: `favorite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipeId: recipeId,
        userId: session.user.id,
        createdAt: new Date()
      })

      // Incrémenter le compteur de favoris de l'utilisateur
      await db.collection('users').updateOne(
        { id: session.user.id },
        { $inc: { favoritesCount: 1 } }
      )

      return NextResponse.json({ favorited: true })
    }

  } catch (error) {
    console.error('Erreur lors de l\'ajout/suppression des favoris:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}