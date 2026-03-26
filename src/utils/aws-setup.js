// AWS Setup Script for Psychology of Power
const S3Manager = require('./s3-manager');

async function setupAWS() {
  console.log('🚀 Setting up AWS S3 for Psychology of Power...');
  
  try {
    // Step 1: Create bucket
    console.log('📦 Creating S3 bucket...');
    const bucketCreated = await S3Manager.createBucket();
    
    if (!bucketCreated) {
      console.log('❌ Failed to create bucket');
      return false;
    }
    
    // Step 2: Set CORS
    console.log('🌐 Setting up CORS configuration...');
    const corsSet = await S3Manager.setBucketCors();
    
    if (!corsSet) {
      console.log('❌ Failed to set CORS');
      return false;
    }
    
    console.log('✅ AWS S3 setup completed successfully!');
    console.log(`🪣 Bucket: psychology-power-videos`);
    console.log(`🌍 Region: eu-west-1 (Ireland)`);
    console.log(`🔗 URL: https://psychology-power-videos.s3.eu-west-1.amazonaws.com`);
    
    return true;
  } catch (error) {
    console.error('❌ AWS setup failed:', error);
    return false;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAWS();
}

module.exports = { setupAWS };
