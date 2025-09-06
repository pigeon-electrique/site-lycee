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
    const recipeId = params.id

    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    const recipe = await db.collection('recipes').findOne({ id: recipeId })

    if (!recipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 })
    }

    // Incrémenter les vues
    await db.collection('recipe_views').insertOne({
      id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipeId: recipeId,
      userId: null, // Pour les utilisateurs non connectés
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      viewedAt: new Date()
    })

    // Mettre à jour le compteur de vues
    await db.collection('recipes').updateOne(
      { id: recipeId },
      { $inc: { views: 1 } }
    )

    return NextResponse.json(recipe)

  } catch (error) {
    console.error('Erreur lors de la récupération de la recette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params
  
  try {
    const recipeId = params.id
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const recipeData = await request.json()
    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    // Vérifier que l'utilisateur est l'auteur ou un admin
    const existingRecipe = await db.collection('recipes').findOne({ id: recipeId })
    
    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 })
    }

    if (existingRecipe.author.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const updateData = {
      ...recipeData,
      updatedAt: new Date(),
      publishedAt: recipeData.isPublished && !existingRecipe.isPublished ? new Date() : existingRecipe.publishedAt
    }

    const result = await db.collection('recipes').updateOne(
      { id: recipeId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params
  
  try {
    const recipeId = params.id
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    // Vérifier que l'utilisateur est l'auteur ou un admin
    const existingRecipe = await db.collection('recipes').findOne({ id: recipeId })
    
    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 })
    }

    if (existingRecipe.author.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Supprimer la recette et les données associées
    await db.collection('recipes').deleteOne({ id: recipeId })
    await db.collection('recipe_views').deleteMany({ recipeId: recipeId })
    await db.collection('recipe_ratings').deleteMany({ recipeId: recipeId })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
