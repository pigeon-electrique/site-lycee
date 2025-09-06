import { NextAuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import clientPromise from './mongodb'
import { config } from './config'

const adapter = process.env.MONGODB_URI && clientPromise
  ? MongoDBAdapter(clientPromise)
  : undefined

export const authOptions: NextAuthOptions = {
  ...(adapter && { adapter }),
  providers: [
    GoogleProvider({
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db('recettes-fr')
          
          const user = await db.collection('users').findOne({ 
            email: credentials.email 
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user'
          }
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error)
          return null
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: false, // false pour le port 587 avec STARTTLS
        tls: {
          rejectUnauthorized: false
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        session.user.id = user?.id || token?.sub || ''
        session.user.role = (user as { role?: string })?.role || (token as { role?: string })?.role || 'user'
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'user'
        
        // Sauvegarder l'utilisateur en BDD lors de la première connexion
        if (account?.provider === 'credentials') {
          try {
            const client = await clientPromise
            const db = client.db('recettes-fr')
            
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await db.collection('users').findOne({ 
              email: user.email 
            })
            
            if (!existingUser) {
              // Créer l'utilisateur en BDD
              await db.collection('users').insertOne({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                createdAt: new Date(),
                emailVerified: null
              })
              console.log('Utilisateur sauvegardé en BDD:', user.email)
            }
          } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
          }
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Utiliser JWT pour Credentials, database pour les autres
  },
}
