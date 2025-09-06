import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/db'
import clientPromise from '@/lib/mongodb'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params asynchrone
) {
  const { id } = await context.params

  try {
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const client = await clientPromise
    if (!client) {
      // Données par défaut si pas de connexion DB
      return NextResponse.json({
        likesGiven: 0,
        favoritesCount: 0,
        joinDate: user.createdAt || null,
      })
    }

    const db = client.db('recettes-fr')

    // Compter les likes donnés par l'utilisateur
    const likesGiven = await db.collection('recipe_likes').countDocuments({
      userId: id
    })

    // Compter les favoris de l'utilisateur
    const favoritesCount = await db.collection('user_favorites').countDocuments({
      userId: id
    })

    return NextResponse.json({
      likesGiven: user.likesGiven || likesGiven,
      favoritesCount: user.favoritesCount || favoritesCount,
      joinDate: user.createdAt || null,
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des stats utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}