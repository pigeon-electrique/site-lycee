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

    // Vérifier si l'utilisateur a déjà liké cette recette
    const existingLike = await db.collection('recipe_likes').findOne({
      recipeId: recipeId,
      userId: session.user.id
    })

    if (existingLike) {
      // Retirer le like
      await db.collection('recipe_likes').deleteOne({
        recipeId: recipeId,
        userId: session.user.id
      })

      // Décrémenter le compteur de likes de la recette
      await db.collection('recipes').updateOne(
        { id: recipeId },
        { $inc: { likes: -1 } }
      )

      // Décrémenter le compteur de likes de l'utilisateur
      await db.collection('users').updateOne(
        { id: session.user.id },
        { $inc: { likesGiven: -1 } }
      )

      return NextResponse.json({ liked: false, likes: Math.max(0, (recipe.likes || 0) - 1) })
    } else {
      // Ajouter le like
      await db.collection('recipe_likes').insertOne({
        id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipeId: recipeId,
        userId: session.user.id,
        createdAt: new Date()
      })

      // Incrémenter le compteur de likes de la recette
      const updatedRecipe = await db.collection('recipes').findOneAndUpdate(
        { id: recipeId },
        { $inc: { likes: 1 } },
        { returnDocument: 'after' }
      )

      // Incrémenter le compteur de likes de l'utilisateur
      await db.collection('users').updateOne(
        { id: session.user.id },
        { $inc: { likesGiven: 1 } }
      )

      return NextResponse.json({ liked: true, likes: updatedRecipe?.likes || (recipe.likes || 0) + 1 })
    }

  } catch (error) {
    console.error('Erreur lors du like de la recette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}