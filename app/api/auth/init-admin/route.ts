import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { setUserAsAdmin } from '@/lib/init-admin'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Utiliser l'ID de la session ou l'email comme fallback
    const userId = session.user.id || session.user.email || 'unknown'
    
    const result = await setUserAsAdmin(userId)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Erreur init admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la définition du rôle admin' }, 
      { status: 500 }
    )
  }
}
