// iOS Compatibility Utilities for Psychology of Power App

export const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
};

export const isSafari = () => {
  return /Safari/.test(navigator.userAgent) && 
         !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
};

export const isIOSVersion = () => {
  if (!isIOS()) return null;
  
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (match) {
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3] || 0, 10),
      full: parseFloat(match[1] + '.' + match[2] + '.' + (match[3] || 0))
    };
  }
  return null;
};

export const isIPhone12 = () => {
  return isIOS() && navigator.userAgent.includes('iPhone13,'); // iPhone 12 series
};

export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: true 
    });
    return stream;
  } catch (error) {
    console.error('Camera permission error:', error);
    
    if (error.name === 'NotAllowedError') {
      throw new Error('Дозвіл на камеру надано відхилено. Перевірте налаштування iOS.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('Камеру не знайдено. Перевірте пристрій.');
    } else if (error.name === 'NotSupportedError') {
      throw new Error('Браузер не підтримує доступ до камери.');
    } else {
      throw new Error('Помилка доступу до камери: ' + error.message);
    }
  }
};

export const requestLocationPermission = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокація не підтримується браузером'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Дозвіл на геолокацію надано відхилено. Перевірте налаштування iOS.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Інформація про місцезнаходження недоступна.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Час очікування геолокації вичерпано.'));
            break;
          default:
            reject(new Error('Невідома помилка геолокації: ' + error.message));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export const preventIOSTouchBounce = () => {
  if (!isIOS()) return;
  
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.no-bounce')) {
      e.preventDefault();
    }
  }, { passive: false });
};

export const fixIOSInputZoom = () => {
  if (!isIOS()) return;
  
  // Add font-size to prevent zoom on input focus
  const style = document.createElement('style');
  style.textContent = `
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      input, textarea, select {
        font-size: 16px !important;
      }
    }
  `;
  document.head.appendChild(style);
};

export const addSafeAreaPadding = () => {
  if (!isIOS()) return;
  
  const style = document.createElement('style');
  style.textContent = `
    .safe-area {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    
    .safe-area-top {
      padding-top: env(safe-area-inset-top);
    }
    
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `;
  document.head.appendChild(style);
};

export const handleIOSMemoryManagement = () => {
  if (!isIOS()) return;
  
  // Listen for memory warnings (iOS specific)
  if ('memory' in performance) {
    const checkMemory = () => {
      const memory = performance.memory;
      const used = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (used > 0.8) {
        console.warn('High memory usage detected:', used);
        // Trigger cleanup
        window.dispatchEvent(new CustomEvent('memorywarning'));
      }
    };
    
    setInterval(checkMemory, 30000); // Check every 30 seconds
  }
};

export const optimizeVideoForIOS = (stream) => {
  if (!isIOS() || !stream) return stream;
  
  const videoTrack = stream.getVideoTracks()[0];
  if (videoTrack) {
    // Apply iOS-specific constraints
    const constraints = {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
      frameRate: { min: 15, ideal: 30, max: 30 },
      facingMode: videoTrack.getSettings().facingMode
    };
    
    return videoTrack.applyConstraints(constraints).then(() => stream);
  }
  
  return stream;
};

export const createIOSOptimizedMediaRecorder = (stream, options = {}) => {
  const defaultOptions = {
    mimeType: isIOS() ? 'video/mp4' : 'video/webm',
    videoBitsPerSecond: isIOS() ? 2500000 : 5000000,
    audioBitsPerSecond: 128000
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // Check if mimeType is supported
  if (!MediaRecorder.isTypeSupported(finalOptions.mimeType)) {
    finalOptions.mimeType = isIOS() ? 'video/mp4' : 'video/webm';
  }
  
  return new MediaRecorder(stream, finalOptions);
};

export const shareContentOnIOS = async (title, text, files = []) => {
  if (navigator.share && isIOS()) {
    try {
      const shareData = {
        title,
        text,
        files: files.length > 0 ? files : undefined
      };
      
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
      return false;
    }
  }
  
  // Fallback for older iOS versions
  if (files.length > 0) {
    // For files, we can't use fallback easily
    alert('Функція поширення недоступна на вашій версії iOS');
    return false;
  }
  
  // For text, copy to clipboard
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
    alert('Текст скопійовано в буфер обміну');
    return true;
  } catch (error) {
    console.error('Clipboard error:', error);
    return false;
  }
};

export const checkPWASupport = () => {
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    manifest: 'manifest' in window,
    beforeInstallPrompt: 'onbeforeinstallprompt' in window,
    share: 'share' in navigator,
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    geolocation: 'geolocation' in navigator,
    notifications: 'Notification' in window,
    pushManager: 'serviceWorker' in navigator && 'PushManager' in window,
    storage: 'indexedDB' in window
  };
  
  support.isFullPWA = Object.values(support).every(Boolean);
  support.isIOS = isIOS();
  support.isSafari = isSafari();
  support.iosVersion = isIOSVersion();
  
  return support;
};

export const initializeIOSCompatibility = () => {
  if (!isIOS()) return;
  
  console.log('Initializing iOS compatibility...');
  
  // Apply iOS fixes
  preventIOSTouchBounce();
  fixIOSInputZoom();
  addSafeAreaPadding();
  handleIOSMemoryManagement();
  
  // Add iOS-specific CSS classes
  document.documentElement.classList.add('ios');
  if (isSafari()) {
    document.documentElement.classList.add('safari');
  }
  
  console.log('iOS compatibility initialized');
};

// Auto-initialize if on iOS
if (typeof window !== 'undefined') {
  if (isIOS()) {
    initializeIOSCompatibility();
  }
  
  // Make utilities available globally
  window.IOSCompatibility = {
    isIOS,
    isSafari,
    isIOSVersion,
    isIPhone12,
    requestCameraPermission,
    requestLocationPermission,
    shareContentOnIOS,
    checkPWASupport,
    createIOSOptimizedMediaRecorder
  };
}
