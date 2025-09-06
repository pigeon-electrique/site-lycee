import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { Category } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Construire le filtre
    const filter: any = {}
    if (active !== null) {
      filter.isActive = active === 'true'
    }

    // Récupérer les catégories avec le nombre de recettes
    const categories = await db.collection('categories')
      .find(filter)
      .sort({ name: 1 })
      .toArray()

    // Compter les recettes pour chaque catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const recipeCount = await db.collection('recipes').countDocuments({
          category: category.id,
          isPublished: true
        })
        return {
          ...category,
          recipeCount
        }
      })
    )

    return NextResponse.json(categoriesWithCount)

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const categoryData = await request.json()
    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Générer un ID unique
    const id = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const category: Category = {
      id,
      name: categoryData.name,
      description: categoryData.description,
      color: categoryData.color,
      icon: categoryData.icon,
      isActive: true,
      recipeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('categories').insertOne(category)

    return NextResponse.json({ 
      success: true, 
      category: { ...category, _id: result.insertedId }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
