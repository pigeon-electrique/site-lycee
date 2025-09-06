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
    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    const category = await db.collection('categories').findOne({ id: params.id })

    if (!category) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    // Compter les recettes dans cette catégorie
    const recipeCount = await db.collection('recipes').countDocuments({
      category: params.id,
      isPublished: true
    })

    return NextResponse.json({
      ...category,
      recipeCount
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error)
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const categoryData = await request.json()
    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    const updateData = {
      ...categoryData,
      updatedAt: new Date()
    }

    const result = await db.collection('categories').updateOne(
      { id: params.id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const client = await clientPromise
    if (!client) {
      throw new Error('Failed to connect to database')
    }
    const db = client.db('recettes-fr')

    // Vérifier s'il y a des recettes dans cette catégorie
    const recipeCount = await db.collection('recipes').countDocuments({
      category: params.id
    })

    if (recipeCount > 0) {
      return NextResponse.json({ 
        error: `Impossible de supprimer cette catégorie. ${recipeCount} recette(s) y sont encore associées.`,
        recipeCount
      }, { status: 400 })
    }

    const result = await db.collection('categories').deleteOne({ id: params.id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
