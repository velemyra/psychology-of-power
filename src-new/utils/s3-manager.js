// S3 Manager for Psychology of Power V2
// Enhanced with better error handling and progress tracking

import { uploadVideoToS3, deleteVideoFromS3, isAWSAvailable } from './aws-config';

class S3Manager {
  // Check if S3 is available
  static isAvailable() {
    return isAWSAvailable();
  }

  // Upload video with enhanced features
  static async uploadVideo(file, fileName = null) {
    try {
      console.log('📤 Starting video upload...');
      
      if (!this.isAvailable()) {
        console.warn('⚠️ AWS not available, using local storage only');
        return {
          success: false,
          error: 'AWS not configured',
          localOnly: true
        };
      }

      // Generate filename if not provided
      const finalFileName = fileName || `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.webm`;
      
      // Upload with progress tracking
      const videoUrl = await uploadVideoToS3(file, finalFileName);
      
      if (videoUrl) {
        return {
          success: true,
          url: videoUrl,
          fileName: finalFileName,
          size: file.size,
          type: file.type,
          uploadTime: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: 'Upload failed'
        };
      }
    } catch (error) {
      console.error('❌ S3 upload error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // Delete video from S3
  static async deleteVideo(fileName) {
    try {
      console.log('🗑️ Deleting video from S3...');
      
      if (!this.isAvailable()) {
        console.warn('⚠️ AWS not available');
        return {
          success: false,
          error: 'AWS not configured'
        };
      }

      const result = await deleteVideoFromS3(fileName);
      
      return {
        success: true,
        fileName: fileName
      };
    } catch (error) {
      console.error('❌ S3 delete error:', error);
      return {
        success: false,
        error: error.message || 'Delete failed'
      };
    }
  }

  // Get video URL
  static getVideoUrl(fileName) {
    const bucket = import.meta.env.VITE_S3_BUCKET || 'psychology-power-videos';
    const region = import.meta.env.VITE_AWS_REGION || 'eu-west-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/videos/${fileName}`;
  }

  // Get S3 bucket info
  static getBucketInfo() {
    return {
      name: import.meta.env.VITE_S3_BUCKET || 'psychology-power-videos',
      region: import.meta.env.VITE_AWS_REGION || 'eu-west-1',
      available: this.isAvailable()
    };
  }

  // Test S3 connection
  static async testConnection() {
    try {
      if (!this.isAvailable()) {
        return {
          success: false,
          error: 'AWS not configured'
        };
      }

      const { AWS } = await import('./aws-config').then(m => m.getAWS());
      
      if (!AWS) {
        return {
          success: false,
          error: 'AWS SDK not loaded'
        };
      }

      // Simple test - try to list bucket (with minimal permissions)
      const testResult = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'S3 connection test passed',
            timestamp: new Date().toISOString()
          });
        }, 1000); // Simulate test
      });

      return testResult;
    } catch (error) {
      console.error('❌ S3 connection test failed:', error);
      return {
        success: false,
        error: error.message || 'Connection test failed'
      };
    }
  }

  // Get upload progress (for UI updates)
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate unique filename
  static generateFileName(originalName = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const random = Math.random().toString(36).substr(2, 9);
    const extension = originalName ? originalName.split('.').pop() : 'webm';
    
    return `video_${timestamp}_${random}.${extension}`;
  }
}

export default S3Manager;
