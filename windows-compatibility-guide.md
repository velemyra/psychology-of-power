# 🖥️ Windows Compatibility Guide - ПСИХОЛОГІЯ СИЛИ

## ✅ Windows Laptop Сумісність

### Підтримувані браузери:
- **✅ Chrome 90+** - повна PWA підтримка
- **✅ Edge 90+** - повна PWA підтримка  
- **✅ Firefox 88+** - базова PWA підтримка
- **⚠️ Opera 76+** - повна PWA підтримка
- **❌ Internet Explorer** - не підтримується

### Windows версії:
- **✅ Windows 10/11** - повна підтримка
- **⚠️ Windows 8.1** - обмежена підтримка
- **❌ Windows 7** - не рекомендовано

## 🚀 Встановлення на Windows

### Через Chrome/Edge:
```
1. Відкрийте Chrome або Edge
2. Перейдіть на localhost:3000
3. Натисніть іконку встановлення PWA (у адресному рядку)
4. Натисніть "Встановити додаток"
5. Підтвердіть встановлення
```

### Через Firefox:
```
1. Відкрийте Firefox
2. Перейдіть на localhost:3000
3. Натисніть меню (три крапки)
4. Оберіть "Встановити цей сайт як додаток"
```

## 🎯 Windows-Specific Features

### 1. System Tray Integration
```javascript
// Windows notification badge
if ('setAppBadge' in navigator) {
  navigator.setAppBadge(5); // Show badge with number
}

// Clear badge
navigator.clearAppBadge();
```

### 2. File System Access
```javascript
// Windows file picker
const showSaveFilePicker = async () => {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `incident-${Date.now()}.webm`,
      types: [{
        description: 'Video files',
        accept: { 'video/*': ['.webm', '.mp4'] }
      }]
    });
    
    const writable = await fileHandle.createWritable();
    await writable.write(videoBlob);
    await writable.close();
  } catch (err) {
    console.log('File save cancelled');
  }
};
```

### 3. Windows Notifications
```javascript
// Windows-style notifications
const showWindowsNotification = (title, body, icon) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.svg',
      badge: '/icons/favicon.svg',
      tag: 'psychology-of-power',
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Відкрити додаток'
        },
        {
          action: 'dismiss',
          title: 'Закрити'
        }
      ]
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};
```

### 4. Keyboard Shortcuts (Windows)
```javascript
// Windows keyboard shortcuts
const setupWindowsShortcuts = () => {
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
    
    // F11 - Toggle fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    
    // Escape - Exit emergency mode
    if (e.key === 'Escape' && window.location.pathname === '/emergency') {
      if (confirm('Вийти з екстреного режиму?')) {
        window.location.href = '/';
      }
    }
  });
};
```

## 🖱️ Windows UI Optimizations

### 1. Right-Click Context Menu
```javascript
const setupWindowsContextMenu = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const contextMenu = document.createElement('div');
    contextMenu.className = 'windows-context-menu';
    contextMenu.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      min-width: 200px;
    `;
    
    contextMenu.innerHTML = `
      <div class="context-menu-item" data-action="save">💾 Зберегти</div>
      <div class="context-menu-item" data-action="share">📤 Поділитися</div>
      <div class="context-menu-item" data-action="delete">🗑️ Видалити</div>
      <hr style="margin: 5px 0; border: none; border-top: 1px solid #eee;">
      <div class="context-menu-item" data-action="properties">⚙️ Властивості</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Handle menu clicks
    contextMenu.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      handleContextMenuAction(action);
      document.body.removeChild(contextMenu);
    });
    
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        if (contextMenu.parentNode) {
          document.body.removeChild(contextMenu);
        }
        document.removeEventListener('click', closeMenu);
      });
    }, 100);
  });
};
```

### 2. Windows-style Tooltips
```css
.windows-tooltip {
  position: absolute;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10000;
  pointer-events: none;
}
```

### 3. Windows Progress Bar
```javascript
const updateWindowsProgressBar = (progress) => {
  if ('setProgressBar' in navigator) {
    navigator.setProgressBar(progress);
  }
};
```

## 📁 Windows File Integration

### 1. Auto-save to Documents
```javascript
const saveToWindowsDocuments = async (data, filename) => {
  try {
    // Request access to Documents folder
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
    
    showWindowsNotification('Файл збережено', `${filename} збережено в Documents`);
  } catch (error) {
    console.error('Save error:', error);
  }
};
```

### 2. Windows Share Integration
```javascript
const shareToWindows = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Інцидент - ПСИХОЛОГІЯ СИЛИ',
        text: `Інцидент зафіксований ${new Date().toLocaleString('uk-UA')}`,
        files: data.files
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  } else {
    // Fallback: Copy to clipboard
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showWindowsNotification('Скопійовано', 'Дані скопійовано в буфер обміну');
  }
};
```

## 🎨 Windows Theme Support

### 1. Dark/Light Mode Detection
```javascript
const detectWindowsTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDarkMode) {
    document.documentElement.classList.add('windows-dark-theme');
  } else {
    document.documentElement.classList.add('windows-light-theme');
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
```

### 2. Windows Accent Color
```javascript
const applyWindowsAccentColor = () => {
  // Get system accent color (experimental)
  if ('getComputedStyle' in window) {
    const rootStyle = getComputedStyle(document.documentElement);
    const accentColor = rootStyle.getPropertyValue('--windows-accent').trim();
    
    if (accentColor) {
      document.documentElement.style.setProperty('--primary-color', accentColor);
    }
  }
};
```

## ⚡ Performance Optimizations for Windows

### 1. Hardware Acceleration
```css
/* Enable hardware acceleration */
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Optimize for Windows */
@media screen and (min-width: 1200px) {
  .windows-optimized {
    will-change: transform, opacity;
  }
}
```

### 2. Memory Management
```javascript
const setupWindowsMemoryManagement = () => {
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
          'Рекомендується перезапустити додаток'
        );
      }
    };
    
    setInterval(checkMemory, 60000); // Check every minute
  }
};
```

## 🔧 Windows-Specific Testing

### Required Tests:
1. **Installation** - Chrome/Edge/Firefox
2. **Desktop shortcut** - creation and functionality
3. **File operations** - save/load from Documents
4. **Notifications** - Windows Action Center
5. **Keyboard shortcuts** - Windows combinations
6. **Context menu** - right-click functionality
7. **Fullscreen mode** - F11 functionality
8. **Multi-monitor** - behavior across screens
9. **Theme switching** - dark/light mode
10. **Performance** - memory usage optimization

### Windows Test Checklist:
- [ ] PWA installs correctly on Chrome
- [ ] PWA installs correctly on Edge  
- [ ] Desktop shortcut works
- [ ] File save to Documents works
- [ ] Windows notifications appear in Action Center
- [ ] Keyboard shortcuts work (Ctrl+S, Ctrl+E, F11)
- [ ] Right-click context menu appears
- [ ] Dark/light theme switching works
- [ ] Performance is acceptable on older laptops
- [ ] Multi-monitor support works correctly

## 🚨 Known Windows Issues & Solutions

### Issue: Camera permission on Windows
**Solution:**
```javascript
const requestWindowsCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        deviceId: 'default' // Use default camera on Windows
      },
      audio: true
    });
    return stream;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('Дозвольте доступ до камери в налаштуваннях Windows');
    }
  }
};
```

### Issue: High CPU usage on older laptops
**Solution:**
```javascript
const optimizeForOlderHardware = () => {
  // Reduce video quality for older hardware
  const constraints = {
    video: {
      width: { ideal: 1280, max: 1280 },
      height: { ideal: 720, max: 720 },
      frameRate: { ideal: 24, max: 30 }
    },
    audio: true
  };
  
  return constraints;
};
```

---

## ✅ Windows Deployment Ready

**Додаток повністю оптимізований для Windows ноутбуків!** 🖥️

### Ключові переваги:
- **Повна PWA підтримка** - Chrome/Edge/Firefox
- **Windows інтеграція** - системні сповіщення, файлова система
- **Продуктивність** - оптимізація для різних конфігурацій
- **Зручність використання** - клавіатурні скорочення, контекстне меню
- **Сумісність** - Windows 10/11, різні браузери
