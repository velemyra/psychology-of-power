// Windows Compatibility Utilities for Psychology of Power App

export const isWindows = () => {
  return navigator.platform.indexOf('Win') > -1 || 
         navigator.userAgent.indexOf('Windows') > -1;
};

export const isChrome = () => {
  return /Chrome/.test(navigator.userAgent) && 
         !/Edge|Edg|Opera|OPR|Seamonkey|Maxthon/.test(navigator.userAgent);
};

export const isEdge = () => {
  return /Edge|Edg/.test(navigator.userAgent);
};

export const isFirefox = () => {
  return /Firefox/.test(navigator.userAgent);
};

export const getWindowsVersion = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf('Windows NT 10.0') > -1) return 'Windows 10/11';
  if (userAgent.indexOf('Windows NT 6.3') > -1) return 'Windows 8.1';
  if (userAgent.indexOf('Windows NT 6.2') > -1) return 'Windows 8';
  if (userAgent.indexOf('Windows NT 6.1') > -1) return 'Windows 7';
  
  return 'Unknown Windows';
};

export const setupWindowsShortcuts = () => {
  if (!isWindows()) return;
  
  document.addEventListener('keydown', (e) => {
    // Ctrl+S - Quick save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleQuickSave();
    }
    
    // Ctrl+E - Emergency mode
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      window.location.href = '/emergency';
    }
    
    // Ctrl+I - Incidents
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      window.location.href = '/incidents';
    }
    
    // Ctrl+C - Complaints
    if (e.ctrlKey && e.key === 'c' && !window.getSelection().toString()) {
      e.preventDefault();
      window.location.href = '/complaints';
    }
    
    // F11 - Toggle fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
    
    // Escape - Exit emergency mode
    if (e.key === 'Escape' && window.location.pathname === '/emergency') {
      if (confirm('Вийти з екстреного режиму?')) {
        window.location.href = '/';
      }
    }
    
    // Ctrl+Shift+S - Screenshot
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      takeScreenshot();
    }
  });
};

export const showWindowsNotification = (title, body, options = {}) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }
  
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: options.icon || '/icons/icon-192x192.svg',
      badge: '/icons/favicon.svg',
      tag: options.tag || 'psychology-of-power',
      requireInteraction: options.requireInteraction || false,
      actions: options.actions || [
        {
          action: 'open',
          title: 'Відкрити додаток'
        },
        {
          action: 'dismiss',
          title: 'Закрити'
        }
      ],
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      
      if (options.onClick) {
        options.onClick();
      }
    };
    
    return notification;
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showWindowsNotification(title, body, options);
      }
    });
  }
};

export const setupWindowsContextMenu = () => {
  if (!isWindows()) return;
  
  document.addEventListener('contextmenu', (e) => {
    // Don't show on inputs and text areas
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    e.preventDefault();
    showWindowsContextMenu(e.clientX, e.clientY, e.target);
  });
};

export const showWindowsContextMenu = (x, y, target) => {
  // Remove existing context menu
  const existingMenu = document.querySelector('.windows-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  const contextMenu = document.createElement('div');
  contextMenu.className = 'windows-context-menu';
  contextMenu.style.cssText = `
    position: fixed;
    top: ${y}px;
    left: ${x}px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    min-width: 200px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
  `;
  
  const menuItems = getContextMenuItems(target);
  
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'context-menu-item';
    menuItem.style.cssText = `
      padding: 8px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    menuItem.innerHTML = `
      <span>${item.icon}</span>
      <span>${item.label}</span>
      ${item.shortcut ? `<span style="margin-left: auto; color: #666; font-size: 12px;">${item.shortcut}</span>` : ''}
    `;
    
    menuItem.addEventListener('click', () => {
      item.action();
      contextMenu.remove();
    });
    
    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#f0f0f0';
    });
    
    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = 'white';
    });
    
    contextMenu.appendChild(menuItem);
  });
  
  document.body.appendChild(contextMenu);
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!contextMenu.contains(e.target)) {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
  
  // Adjust position if menu goes off screen
  setTimeout(() => {
    const rect = contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      contextMenu.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      contextMenu.style.top = (y - rect.height) + 'px';
    }
  }, 0);
};

export const getContextMenuItems = (target) => {
  const items = [
    {
      icon: '💾',
      label: 'Зберегти',
      shortcut: 'Ctrl+S',
      action: handleQuickSave
    },
    {
      icon: '📤',
      label: 'Поділитися',
      action: handleShare
    },
    {
      icon: '📋',
      label: 'Копіювати',
      shortcut: 'Ctrl+C',
      action: handleCopy
    }
  ];
  
  // Add context-specific items
  if (target && target.closest('.incident-item')) {
    items.push(
      { icon: '🗑️', label: 'Видалити інцидент', action: () => handleDeleteIncident(target) },
      { icon: '⚙️', label: 'Властивості', action: () => showIncidentProperties(target) }
    );
  }
  
  if (target && target.closest('video')) {
    items.push(
      { icon: '📹', label: 'Зробити скріншот', shortcut: 'Ctrl+Shift+S', action: takeVideoScreenshot }
    );
  }
  
  items.push(
    { icon: '🔄', label: 'Оновити', shortcut: 'F5', action: () => window.location.reload() },
    { icon: '⚙️', label: 'Налаштування', action: () => window.location.href = '/profile' }
  );
  
  return items;
};

export const saveToWindowsDocuments = async (data, filename) => {
  try {
    if ('showSaveFilePicker' in window) {
      // Modern File System Access API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Psychology of Power files',
          accept: { 'application/json': ['.json'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      showWindowsNotification('Файл збережено', `${filename} збережено успішно`);
    } else {
      // Fallback: Download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
      showWindowsNotification('Файл завантажено', `${filename} завантажено`);
    }
  } catch (error) {
    console.error('Save error:', error);
    showWindowsNotification('Помилка збереження', error.message);
  }
};

export const shareToWindows = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Інцидент - ПСИХОЛОГІЯ СИЛИ',
        text: `Інцидент зафіксований ${new Date().toLocaleString('uk-UA')}`,
        files: data.files || []
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        fallbackShare(data);
      }
    }
  } else {
    fallbackShare(data);
  }
};

export const fallbackShare = async (data) => {
  try {
    if (data.text) {
      await navigator.clipboard.writeText(data.text);
      showWindowsNotification('Скопійовано', 'Текст скопійовано в буфер обміну');
    }
    
    if (data.files && data.files.length > 0) {
      // For files, we can only copy text info
      const fileInfo = data.files.map(file => `📎 ${file.name}`).join('\n');
      await navigator.clipboard.writeText(fileInfo);
      showWindowsNotification('Інформація скопійована', 'Список файлів скопійовано в буфер обміну');
    }
  } catch (error) {
    console.error('Clipboard error:', error);
  }
};

export const updateWindowsProgressBar = (progress) => {
  if ('setAppBadge' in navigator) {
    if (progress > 0 && progress < 1) {
      navigator.setAppBadge(Math.ceil(progress * 100));
    } else if (progress >= 1) {
      navigator.setAppBadge(0);
    } else {
      navigator.clearAppBadge();
    }
  }
};

export const detectWindowsTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDarkMode) {
    document.documentElement.classList.add('windows-dark-theme');
    document.documentElement.classList.remove('windows-light-theme');
  } else {
    document.documentElement.classList.add('windows-light-theme');
    document.documentElement.classList.remove('windows-dark-theme');
  }
  
  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('windows-dark-theme');
      document.documentElement.classList.remove('windows-light-theme');
    } else {
      document.documentElement.classList.add('windows-light-theme');
      document.documentElement.classList.remove('windows-dark-theme');
    }
  });
};

export const setupWindowsMemoryManagement = () => {
  if (!isWindows()) return;
  
  // Monitor memory usage on Windows
  if ('memory' in performance) {
    const checkMemory = () => {
      const memory = performance.memory;
      const used = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (used > 0.85) {
        console.warn('High memory usage on Windows:', used);
        
        // Trigger cleanup
        window.dispatchEvent(new CustomEvent('memorywarning'));
        
        // Show Windows notification
        showWindowsNotification(
          'Високе використання пам\'яті',
          'Рекомендується перезапустити додаток для кращої продуктивності',
          {
            tag: 'memory-warning',
            requireInteraction: true
          }
        );
      }
    };
    
    setInterval(checkMemory, 60000); // Check every minute
  }
};

export const optimizeForOlderHardware = () => {
  const isOlderHardware = !navigator.hardwareConcurrency || 
                         navigator.hardwareConcurrency < 4 ||
                         (navigator.deviceMemory && navigator.deviceMemory < 4);
  
  if (isOlderHardware) {
    console.log('Detected older hardware, applying optimizations');
    
    // Reduce video quality
    window.olderHardwareMode = true;
    
    // Add CSS class for styling
    document.documentElement.classList.add('older-hardware');
    
    // Show notification
    showWindowsNotification(
      'Оптимізація для старого обладнання',
      'Застосовано налаштування для кращої продуктивності'
    );
  }
};

export const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen();
  }
};

export const takeScreenshot = async () => {
  try {
    if ('getDisplayMedia' in navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `screenshot-${Date.now()}.png`;
          a.click();
          
          URL.revokeObjectURL(url);
          stream.getTracks().forEach(track => track.stop());
          
          showWindowsNotification('Скріншот збережено', 'Скріншот успішно збережено');
        });
      });
    }
  } catch (error) {
    console.error('Screenshot error:', error);
    showWindowsNotification('Помилка скріншоту', 'Не вдалося зробити скріншот');
  }
};

// Helper functions
const handleQuickSave = () => {
  window.dispatchEvent(new CustomEvent('quicksave'));
};

const handleShare = () => {
  window.dispatchEvent(new CustomEvent('share'));
};

const handleCopy = () => {
  const selection = window.getSelection();
  if (selection.toString()) {
    document.execCommand('copy');
    showWindowsNotification('Скопійовано', 'Текст скопійовано в буфер обміну');
  }
};

const handleDeleteIncident = (target) => {
  window.dispatchEvent(new CustomEvent('delete-incident', { detail: { target } }));
};

const showIncidentProperties = (target) => {
  window.dispatchEvent(new CustomEvent('show-incident-properties', { detail: { target } }));
};

const takeVideoScreenshot = () => {
  window.dispatchEvent(new CustomEvent('video-screenshot'));
};

// Initialize Windows compatibility
export const initializeWindowsCompatibility = () => {
  if (!isWindows()) return;
  
  console.log('Initializing Windows compatibility...');
  
  // Apply Windows-specific features
  setupWindowsShortcuts();
  setupWindowsContextMenu();
  detectWindowsTheme();
  setupWindowsMemoryManagement();
  optimizeForOlderHardware();
  
  // Add Windows-specific CSS classes
  document.documentElement.classList.add('windows');
  if (isChrome()) document.documentElement.classList.add('chrome');
  if (isEdge()) document.documentElement.classList.add('edge');
  if (isFirefox()) document.documentElement.classList.add('firefox');
  
  console.log('Windows compatibility initialized');
};

// Auto-initialize if on Windows
if (typeof window !== 'undefined') {
  if (isWindows()) {
    initializeWindowsCompatibility();
  }
  
  // Make utilities available globally
  window.WindowsCompatibility = {
    isWindows,
    isChrome,
    isEdge,
    isFirefox,
    getWindowsVersion,
    showWindowsNotification,
    saveToWindowsDocuments,
    shareToWindows,
    updateWindowsProgressBar,
    toggleFullscreen,
    takeScreenshot
  };
}
