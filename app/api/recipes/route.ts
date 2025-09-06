import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { Recipe } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Construire le filtre
    const filter: any = {}
    
    if (category) {
      filter.category = category
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    if (published !== null) {
      filter.isPublished = published === 'true'
    }

    // Compter le total
    const total = await db.collection('recipes').countDocuments(filter)

    // Récupérer les recettes
    const recipes = await db.collection('recipes')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

      // Initialiser les likes à 0 si pas défini
    recipes.forEach(recipe => {
      if (recipe.likes === undefined) {
        recipe.likes = 0
      }
    })

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
    console.error('Erreur lors de la récupération des recettes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const recipeData = await request.json()
    const client = await clientPromise
    const db = client.db('recettes-fr')

    // Générer un ID unique
    const id = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const recipe: Recipe = {
      id,
      title: recipeData.title,
      description: recipeData.description,
      content: recipeData.content,
      category: recipeData.category,
      images: recipeData.images || [],
      ingredients: recipeData.ingredients || [],
      steps: recipeData.steps || [],
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      author: {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || ''
      },
      tags: recipeData.tags || [],
      views: 0,
      likes: 0,
      rating: 0,
      ratingCount: 0,
      isPublished: recipeData.isPublished || false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: recipeData.isPublished ? new Date() : undefined
    }

    const result = await db.collection('recipes').insertOne(recipe)

    return NextResponse.json({ 
      success: true, 
      recipe: { ...recipe, _id: result.insertedId }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de la recette:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
