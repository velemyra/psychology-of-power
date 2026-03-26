// AWS Configuration for Psychology of Power V2
// Enhanced with better error handling and security

let AWS = null;
let s3 = null;

// Initialize AWS with proper error handling
const initAWS = async () => {
  try {
    if (typeof window !== 'undefined' && !AWS) {
      console.log('🔄 Initializing AWS SDK...')
      
      // Load AWS SDK dynamically
      const awsModule = await import('aws-sdk')
      AWS = awsModule.default;
      
      // Configure AWS with environment variables
      AWS.config.update({
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        region: import.meta.env.VITE_AWS_REGION || 'eu-west-1',
        // Add retry configuration for better reliability
        maxRetries: 3,
        retryDelayOptions: {
          customBackoff: function(retryCount) {
            return Math.pow(2, retryCount) * 100; // Exponential backoff
          }
        }
      });
      
      // Initialize S3
      s3 = new AWS.S3({
        params: {
          Bucket: import.meta.env.VITE_S3_BUCKET || 'psychology-power-videos'
        }
      });
      
      console.log('✅ AWS initialized successfully')
      return { AWS, s3 };
    }
  } catch (error) {
    console.error('❌ AWS initialization failed:', error)
    return { AWS: null, s3: null };
  }
};

// S3 Bucket configuration
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET || 'psychology-power-videos';

// Get AWS instances (with lazy initialization)
export const getAWS = async () => {
  if (!AWS || !s3) {
    return await initAWS();
  }
  return { AWS, s3 };
};

// Upload video to S3 with enhanced error handling
export const uploadVideoToS3 = async (file, fileName) => {
  try {
    console.log('📤 Starting S3 upload:', fileName)
    
    const { AWS, s3 } = await getAWS();
    
    if (!AWS || !s3) {
      throw new Error('AWS not initialized');
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: file,
      ContentType: file.type || 'video/webm',
      ACL: 'public-read',
      // Add metadata
      Metadata: {
        'original-name': file.name || 'video',
        'upload-time': new Date().toISOString(),
        'app-version': '2.0.0'
      }
    };

    const upload = s3.upload(params);
    
    return new Promise((resolve, reject) => {
      upload.on('httpUploadProgress', (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        console.log(`📊 Upload progress: ${percent}%`);
      });
      
      upload.on('error', (error) => {
        console.error('❌ S3 upload error:', error);
        reject(error);
      });
      
      upload.send((error, data) => {
        if (error) {
          reject(error);
        } else {
          const videoUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;
          console.log('✅ Video uploaded successfully:', videoUrl);
          resolve(videoUrl);
        }
      });
    });
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// Delete video from S3
export const deleteVideoFromS3 = async (fileName) => {
  try {
    console.log('🗑️ Deleting S3 file:', fileName)
    
    const { AWS, s3 } = await getAWS();
    
    if (!AWS || !s3) {
      throw new Error('AWS not initialized');
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (error, data) => {
        if (error) {
          console.error('❌ S3 delete error:', error);
          reject(error);
        } else {
          console.log('✅ File deleted successfully:', fileName);
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('❌ Delete failed:', error);
    throw error;
  }
};

// Check AWS availability
export const isAWSAvailable = () => {
  return !!(import.meta.env.VITE_AWS_ACCESS_KEY_ID && 
           import.meta.env.VITE_AWS_SECRET_ACCESS_KEY);
};

// Export configured instances and utilities
export { initAWS, getAWS, S3_BUCKET, uploadVideoToS3, deleteVideoFromS3, isAWSAvailable };
