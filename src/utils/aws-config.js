// AWS Configuration for Psychology of Power
const AWS = require('aws-sdk');

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: 'AKIATUYS5E7UPUPVZAWX',
  secretAccessKey: 'aFr63kSYwey43wzCw/nlcNS5eUdd2+lk2UwuxrcF',
  region: 'eu-west-1' // Ireland region
});

// Create S3 instance
const s3 = new AWS.S3();

// S3 Bucket configuration
const S3_BUCKET = 'psychology-power-videos';

// Export configured instances
module.exports = {
  s3,
  S3_BUCKET,
  AWS
};
