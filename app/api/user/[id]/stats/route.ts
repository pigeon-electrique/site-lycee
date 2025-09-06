import { NextResponse } from 'next/server'
import { getUserById, getUserStats } from '@/lib/db'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params asynchrone
) {
  const { id } = await context.params

  const user = await getUserById(id)
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
  }

  const stats = await getUserStats(id)

  return NextResponse.json({
    recipesLiked: stats?.recipesLiked || 0,
    favoriteRecipes: stats?.favoriteRecipes || 0,
    joinDate: user.createdAt || null,
  })
}