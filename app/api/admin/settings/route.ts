import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

interface SiteSettings {
  name: string
  description: string
  contactEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  recipesPerPage: number
  maxImageSize: number
  requireEmailVerification: boolean
  autoDeleteInactiveUsers: boolean
  inactiveUserDays: number
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      )
    }
    const db = client.db()
    
    const settings = await db.collection('settings').findOne({
      type: 'site_settings'
    })

    if (!settings) {
      // Retourner les paramètres par défaut si aucun n'existe
      const defaultSettings: SiteSettings = {
        name: 'Pâtisserie',
        description: 'Partagez vos meilleures recettes de pâtisserie',
        contactEmail: 'contact@patisserie.fr',
        maintenanceMode: false,
        allowRegistration: true,
        recipesPerPage: 12,
        maxImageSize: 5,
        requireEmailVerification: true,
        autoDeleteInactiveUsers: false,
        inactiveUserDays: 365
      }
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const settings = await request.json()

    // Validation basique
    if (!settings.name || !settings.contactEmail) {
      return NextResponse.json(
        { error: 'Le nom du site et l\'email de contact sont requis' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      )
    }
    const db = client.db()

    await db.collection('settings').updateOne(
      { type: 'site_settings' },
      { 
        $set: {
          ...settings,
          type: 'site_settings',
          updatedAt: new Date(),
          updatedBy: session.user.email
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
