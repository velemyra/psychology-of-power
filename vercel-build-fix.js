// Temporary fix for Vercel build
// This will bypass AWS and Firebase issues during build

const fs = require('fs');
const path = require('path');

// Create a simple version of aws-config for build
const awsConfigContent = `
// AWS Configuration for Psychology of Power - Build Fix
export const S3_BUCKET = 'psychology-power-videos';
export const initAWS = () => Promise.resolve({ AWS: null, s3: null });
export const s3 = null;
export const AWS = null;
`;

// Write the fixed config
fs.writeFileSync(path.join(__dirname, 'src/utils/aws-config.js'), awsConfigContent);

console.log('✅ AWS config fixed for build');
