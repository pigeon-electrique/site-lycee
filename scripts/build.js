const { execSync } = require('child_process');

console.log('🚀 Building for production...');

try {
  // Build the Next.js app
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('📦 Ready for deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
