// Utilisation de fetch natif de Node.js 18+

async function testAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Test des APIs...');
  
  try {
    // Test de l'API NextAuth
    console.log('📡 Test de /api/auth/providers...');
    const providersResponse = await fetch(`${baseUrl}/api/auth/providers`);
    const providers = await providersResponse.json();
    console.log('✅ Providers NextAuth:', Object.keys(providers));
    
    // Test de l'API d'initialisation admin
    console.log('📡 Test de /api/auth/init-admin...');
    const initResponse = await fetch(`${baseUrl}/api/auth/init-admin`, {
      method: 'POST'
    });
    console.log('✅ Init admin status:', initResponse.status);
    
    // Test de la page d'accueil
    console.log('📡 Test de la page d\'accueil...');
    const homeResponse = await fetch(`${baseUrl}/`);
    console.log('✅ Page d\'accueil status:', homeResponse.status);
    
  } catch (error) {
    console.error('❌ Erreur API:', error.message);
    console.log('💡 Assurez-vous que le serveur est démarré: npm run dev');
  }
}

// Attendre un peu que le serveur démarre
setTimeout(testAPI, 3000);
