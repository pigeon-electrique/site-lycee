import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

export async function initAdmin() {
  try {
    if (!clientPromise) {
      console.log('Mode démonstration : MongoDB non configuré')
      return
    }
    
    const client = await clientPromise
    // Utilise la DB par défaut définie par l'URI de connexion si présente
    const db = client.db() // si l'URI contient /nomDB alors ce sera utilisé
    const users = db.collection('users')
    
    // Vérifier s'il y a déjà des utilisateurs
    const userCount = await users.countDocuments()
    
    if (userCount === 0) {
      console.log('Aucun utilisateur trouvé. Le premier utilisateur connecté sera admin.')
      return
    }
    
    // Vérifier s'il y a déjà un admin
    const adminExists = await users.findOne({ role: 'admin' })
    
    if (!adminExists) {
      console.log('Aucun admin trouvé. Le prochain utilisateur connecté sera admin.')
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation admin:', error)
  }
}

export async function setUserAsAdmin(userId: string) {
  try {
    // Vérifier si MongoDB est disponible
    if (!clientPromise || !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      console.log('MongoDB non configuré. Mode démonstration activé.')
      return { success: true, message: 'Mode démonstration - Admin simulé' }
    }

    const client = await clientPromise
    const db = client.db('patisserie')
    const users = db.collection('users')
    
    // Vérifier s'il y a déjà un admin
    const adminExists = await users.findOne({ role: 'admin' })
    
    if (!adminExists) {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { role: 'admin' } }
      )
      console.log('Utilisateur défini comme admin:', userId)
      return { success: true, message: 'Rôle admin défini avec succès' }
    } else {
      return { success: false, message: 'Un administrateur existe déjà' }
    }
  } catch (error) {
    console.error('Erreur lors de la définition admin:', error)
    return { success: false, message: 'Erreur de base de données' }
  }
}
