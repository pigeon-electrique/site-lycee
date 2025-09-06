import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

export async function getUserById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    let user = null

    // Si c’est un ObjectId valide, on tente la recherche par _id
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      user = await users.findOne({ _id: new ObjectId(id) })
    }

    // Sinon on tente par "id" (string stockée)
    if (!user) {
      user = await users.findOne({ id })
    }

    return user
  } catch (err) {
    console.error('Erreur getUserById:', err)
    return null
  }
}

export async function getUserStats(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const stats = db.collection('userStats')

    let data = null
    if (/^[0-9a-fA-F]{24}$/.test(userId)) {
      data = await stats.findOne({ userId: new ObjectId(userId) })
    }
    if (!data) {
      data = await stats.findOne({ userId })
    }

    return data
  } catch (err) {
    console.error('Erreur getUserStats:', err)
    return null
  }
}

export async function getUserActivity(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const activity = db.collection('userActivity')

    let data = []
    if (/^[0-9a-fA-F]{24}$/.test(userId)) {
      data = await activity.find({ userId: new ObjectId(userId) }).toArray()
    }
    if (!data || data.length === 0) {
      data = await activity.find({ userId }).toArray()
    }

    return data
  } catch (err) {
    console.error('Erreur getUserActivity:', err)
    return []
  }
}
