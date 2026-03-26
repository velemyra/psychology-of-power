// S3 Manager for Psychology of Power
const { s3, S3_BUCKET } = require('./aws-config');

class S3Manager {
  // Create S3 bucket
  static async createBucket() {
    try {
      const params = {
        Bucket: S3_BUCKET,
        CreateBucketConfiguration: {
          LocationConstraint: 'eu-west-1'
        }
      };
      
      await s3.createBucket(params).promise();
      console.log(`✅ Bucket ${S3_BUCKET} created successfully`);
      return true;
    } catch (error) {
      if (error.code === 'BucketAlreadyOwnedByYou') {
        console.log(`✅ Bucket ${S3_BUCKET} already exists`);
        return true;
      }
      console.error('❌ Error creating bucket:', error);
      return false;
    }
  }

  // Set bucket CORS configuration
  static async setBucketCors() {
    try {
      const corsParams = {
        Bucket: S3_BUCKET,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ['*'],
              AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
              AllowedOrigins: ['*'],
              ExposeHeaders: ['ETag']
            }
          ]
        }
      };

      await s3.putBucketCors(corsParams).promise();
      console.log('✅ CORS configuration set successfully');
      return true;
    } catch (error) {
      console.error('❌ Error setting CORS:', error);
      return false;
    }
  }

  // Upload video to S3
  static async uploadVideo(file, fileName) {
    try {
      const params = {
        Bucket: S3_BUCKET,
        Key: `videos/${fileName}`,
        Body: file,
        ContentType: 'video/mp4',
        ACL: 'public-read'
      };

      const result = await s3.upload(params).promise();
      console.log(`✅ Video uploaded: ${result.Location}`);
      return result.Location;
    } catch (error) {
      console.error('❌ Error uploading video:', error);
      return null;
    }
  }

  // Get video URL
  static getVideoUrl(fileName) {
    return `https://${S3_BUCKET}.s3.eu-west-1.amazonaws.com/videos/${fileName}`;
  }
}

module.exports = S3Manager;
