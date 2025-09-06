import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// API publique pour récupérer uniquement les informations nécessaires à l'affichage
export async function GET() {
  try {
    const client = await clientPromise
    if (!client) {
      return NextResponse.json(
        { 
          name: 'Pâtisserie',
          description: 'Partagez vos meilleures recettes de pâtisserie',
          contactEmail: 'contact@patisserie.fr'
        },
        { status: 200 }
      )
    }
    
    const db = client.db()
    
    const settings = await db.collection('settings').findOne({
      type: 'site_settings'
    })

    if (!settings) {
      // Retourner les paramètres par défaut si aucun n'existe
      return NextResponse.json({
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
      })
    }

    // Retourner seulement les informations publiques
    const publicConfig = {
      name: settings.name || 'Pâtisserie',
      description: settings.description || 'Partagez vos meilleures recettes de pâtisserie',
      contactEmail: settings.contactEmail || 'contact@patisserie.fr',
      maintenanceMode: settings.maintenanceMode || false,
      allowRegistration: settings.allowRegistration !== undefined ? settings.allowRegistration : true,
      recipesPerPage: settings.recipesPerPage || 12,
      maxImageSize: settings.maxImageSize || 5,
      requireEmailVerification: settings.requireEmailVerification !== undefined ? settings.requireEmailVerification : true,
      autoDeleteInactiveUsers: settings.autoDeleteInactiveUsers || false,
      inactiveUserDays: settings.inactiveUserDays || 365
    }

    return NextResponse.json(publicConfig)
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error)
    return NextResponse.json(
      { 
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
      },
      { status: 200 }
    )
  }
}