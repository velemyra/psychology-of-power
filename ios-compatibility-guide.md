# 📱 iOS Compatibility Guide - ПСИХОЛОГІЯ СИЛИ

## ✅ iPhone 12 Сумісність

### Підтримувані функції на iOS
- **✅ PWA встановлення** - через Safari "На домашній екран"
- **✅ Камера** - фронтальна та основна
- **✅ Геолокація** - GPS координати
- **✅ Відеозапис** - WebRTC підтримка
- **✅ Офлайн режим** - IndexedDB працює
- **✅ Push сповіщення** - через Service Worker
- **✅ Вібрація** - для SOS режиму

### iOS Обмеження та рішення

#### 🚫 Обмеження:
1. **Background recording** - iOS не дозволяє запис у фоновому режимі
2. **Multiple camera streams** - одночасний запис з 2 камер обмежений
3. **Install prompt** - доводиться встановлювати вручну через Safari

#### ✅ Рішення:
1. **Активне записування** - додаток залишається активним під час запису
2. **Alternating cameras** - перемикання між камерами замість одночасного запису
3. **Manual installation** - інструкції для користувачів

## 🛠️ Налаштування для iOS

### 1. Встановлення на iPhone 12
```
1. Відкрийте Safari
2. Перейдіть на localhost:3000
3. Натисніть "Поділитися" 
4. Оберіть "На домашній екран"
5. Натисніть "Додати"
```

### 2. Дозволи для iOS
```javascript
// Запит дозволів для камери
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' },
      audio: true 
    });
    return stream;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('Потрібен дозвіл на використання камери в налаштуваннях iOS');
    }
  }
};
```

### 3. iOS Specific CSS
```css
/* Fix for iOS Safari */
input, textarea {
  -webkit-appearance: none;
  border-radius: 0;
}

/* Prevent zoom on input focus */
@media screen and (-webkit-min-device-pixel-ratio:0) {
  select, textarea, input[type="text"], input[type="password"],
  input[type="datetime"], input[type="datetime-local"], 
  input[type="date"], input[type="month"], input[type="time"], 
  input[type="week"], input[type="number"], input[type="email"],
  input[type="url"], input[type="search"], input[type="tel"], 
  input[type="color"] {
    font-size: 16px !important;
  }
}

/* Safe area for iPhone X+ */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## 📋 Тестування на iPhone 12

### Обов'язкові тести:
1. **Встановлення** - через Safari
2. **Камера** - фронтальна та основна
3. **Геолокація** - точність GPS
4. **Відеозапис** - якість та тривалість
5. **Офлайн** - робота без інтернету
6. **SOS режим** - швидкість активації
7. **Інциденти** - збереження та перегляд
8. **Підписки** - оплата та статус

### iOS Safari Testing:
```javascript
// Перевірка iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);

// Перевірка PWA підтримки
const isPWASupported = 'serviceWorker' in navigator && 'manifest' in window;

// iOS версія
const iOSVersion = parseFloat(
  ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
  .replace('undefined', '3_2').replace('_', '.').replace('_', '')
) || 0;
```

## 🔧 Оптимізація для iOS

### 1. Performance
```javascript
// Prevent bounce scrolling on iOS
document.body.addEventListener('touchmove', (e) => {
  if (e.target.closest('.no-bounce')) {
    e.preventDefault();
  }
}, { passive: false });

// Smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';
```

### 2. Memory Management
```javascript
// Clean up video streams
const cleanupStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

// Handle memory warnings
window.addEventListener('memorywarning', () => {
  // Clear cached data
  localStorage.clear();
});
```

### 3. Battery Optimization
```javascript
// Monitor battery level
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    battery.addEventListener('levelchange', () => {
      if (battery.level < 0.2) {
        // Reduce quality for low battery
        console.log('Low battery detected');
      }
    });
  });
}
```

## 📱 MacBook Compatibility

### macOS Safari Support:
- **✅ Full PWA support** - desktop Safari 13.1+
- **✅ Camera access** - macOS 10.14+
- **✅ Notifications** - macOS 10.14+
- **✅ File system** - download/upload support

### Testing on MacBook:
1. **Safari 13.1+** - повна PWA підтримка
2. **Chrome/Edge** - альтернативні браузери
3. **Responsive design** - різні розміри екрану
4. **Keyboard navigation** - accessibility

## 🚨 Відомі проблеми та рішення

### Проблема: Camera не працює на iOS
**Рішення:**
```javascript
// Використовуйте правильні constraints
const constraints = {
  video: {
    facingMode: 'environment',
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  },
  audio: true
};
```

### Проблема: Геолокація неточна
**Рішення:**
```javascript
// Високоточна геолокація
navigator.geolocation.getCurrentPosition(
  position => {
    // High accuracy position
  },
  error => {
    // Fallback to lower accuracy
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
);
```

### Проблема: Додаток не встановлюється
**Рішення:**
```javascript
// Перевірка HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  alert('PWA потребує HTTPS для встановлення');
}
```

## 📊 Performance Metrics

### Цілі для iPhone 12:
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Time to Interactive** < 3.0s
- **Cumulative Layout Shift** < 0.1

### Моніторинг:
```javascript
// Performance monitoring
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry.name, entry.duration);
  });
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

## 🔔 Push Notifications на iOS

### Вимоги:
- iOS 16.4+ для PWA push notifications
- HTTPS протокол
- Користувацький дозвіл

### Реалізація:
```javascript
// Request notification permission
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Subscribe to push
    const subscription = await navigator.serviceWorker.ready.then(registration => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
    });
    return subscription;
  }
};
```

---

## ✅ Checklist перед запуском

### iPhone 12:
- [ ] Встановлення через Safari працює
- [ ] Камера (фронтальна/основна) працює
- [ ] Геолокація точна
- [ ] Відеозапис якісний
- [ ] Офлайн режим працює
- [ ] Підписки функціонують
- [ ] Push notifications (iOS 16.4+)
- [ ] Responsive design
- [ ] Performance metrics OK

### MacBook:
- [ ] Safari 13.1+ підтримка
- [ ] Chrome/Edge сумісність
- [ ] Desktop UI адаптація
- [ ] Keyboard navigation
- [ ] File download/upload

**Готово до тестування на iPhone 12 та MacBook!** 🚀
