import { MongoClient } from 'mongodb'
import { config } from './config'


const uri = process.env.MONGODB_URI || config.mongodb.uri || 'mongodb://localhost:27017/recettes-fr'
const options = {}


let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null


if (process.env.MONGODB_URI || config.mongodb.uri) {
  // On crée la connexion — en dev on met en cache global pour éviter plusieurs connexions
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  console.log('Mode démonstration : MongoDB non configuré')
}


export default clientPromise