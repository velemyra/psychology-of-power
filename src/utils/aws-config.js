// AWS Configuration for Psychology of Power
// Note: AWS SDK will be loaded dynamically in production

let AWS = null;
let s3 = null;

// Initialize AWS only in production environment
const initAWS = () => {
  if (typeof window !== 'undefined' && !AWS) {
    // Browser environment - load AWS SDK dynamically
    return import('aws-sdk').then(awsModule => {
      AWS = awsModule.default;
      
      AWS.config.update({
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        region: import.meta.env.VITE_AWS_REGION || 'eu-west-1'
      });
      
      s3 = new AWS.S3();
      return { AWS, s3 };
    });
  }
  return Promise.resolve({ AWS, s3 });
};

// S3 Bucket configuration
const S3_BUCKET = 'psychology-power-videos';

// Export configured instances
export { initAWS, s3, S3_BUCKET, AWS };
