// Configuration temporaire pour le développement
export const config = {
  nextAuth: {
    url: process.env.NEXTAUTH_URL || 'fake_ip',
    secret: process.env.NEXTAUTH_SECRET || 'fake_clé',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'fake_db',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'fake_google',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'fake_google_key',
  },
}
