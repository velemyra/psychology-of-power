# 🖥️ Windows Testing Guide - ПСИХОЛОГІЯ СИЛИ

## 🚀 Швидкий старт для Windows

### 1. Встановлення Node.js
```bash
# Завантажте з https://nodejs.org/
# Версія 18+ рекомендована
```

### 2. Запуск додатку
```bash
# Відкрийте термінал (CMD/PowerShell)
cd C:\Users\user\CascadeProjects\psychology-of-power
npm install
npm run dev
```

### 3. Встановлення PWA
```
1. Відкрийте Chrome або Edge
2. Перейдіть на http://localhost:3000
3. Натисніть іконку ⬇ (встановлення) в адресному рядку
4. Натисніть "Встановити додаток"
```

## ✅ Обов'язкові тести на Windows

### 🎯 Базовий функціонал
- [ ] **Встановлення PWA** - через Chrome/Edge
- [ ] **Desktop shortcut** - створюється та працює
- [ ] **Автономна робота** - без інтернету
- [ ] **Оновлення** - автоматичне оновлення PWA

### 📹 Екстрений режим
- [ ] **Камера** - фронтальна та основна
- [ ] **Відеозапис** - якість та стабільність
- [ ] **Геолокація** - точність визначення
- [ ] **Аудіо питання** - відтворення працює
- [ ] **SOS кнопка** - миттєве спрацьовування

### 📁 Управління даними
- [ ] **Збереження інцидентів** - в IndexedDB
- [ ] **Пошук** - по інцидентах працює
- [ ] **Фільтрація** - за типом/датою
- [ ] **Видалення** - інциденти видаляються
- [ ] **Експорт** - дані експортуються

### ⌨️ Windows-специфічні функції
- [ ] **Ctrl+S** - швидке збереження
- [ ] **Ctrl+E** - перехід в екстрений режим
- [ ] **Ctrl+I** - відкрити інциденти
- [ ] **F11** - повноекранний режим
- [ ] **Правий клік** - контекстне меню

### 🎨 UI/UX на Windows
- [ ] **Темна тема** - автоматичне перемикання
- [ ] **Scrollbars** - Windows-стиль
- [ ] **Шрифти** - Segoe UI на Windows
- [ ] **Анімації** - плавні та швидкі
- [ ] **Responsive** - різні розміри вікон

### 🔔 Сповіщення
- [ ] **Windows notifications** - з'являються в Action Center
- [ ] **Badge** - лічильник на іконці
- [ ] **Звуки** - системні звуки Windows
- [ ] **Пермішени** - запит дозволів працює

## 🛠️ Тестування в різних браузерах

### Google Chrome (рекомендовано)
```bash
# Перевірте версію Chrome 90+
chrome://version/
```
- ✅ Повна PWA підтримка
- ✅ File System Access API
- ✅ WebRTC (камера/мікрофон)
- ✅ Geolocation API
- ✅ Push notifications

### Microsoft Edge
```bash
# Перевірте версію Edge 90+
edge://version/
```
- ✅ Повна PWA підтримка
- ✅ Windows інтеграція
- ✅ System tray
- ✅ Share target

### Firefox (обмежено)
- ⚠️ Базова PWA підтримка
- ⚠️ Обмежена File System API
- ✅ Камера/мікрофон
- ✅ Geolocation

## 📊 Перевірка продуктивності

### Chrome DevTools
```
F12 → Performance → Record
```
**Цілі:**
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.0s
- Cumulative Layout Shift < 0.1

### Windows Task Manager
```
Ctrl+Shift+Esc → Processes
```
**Моніторинг:**
- CPU usage < 50%
- Memory usage < 500MB
- Disk activity нормальна

## 🔧 Windows-Specific налаштування

### 1. Дозволи для камери
```
Windows Settings → Privacy → Camera → Allow apps to access camera
```

### 2. Дозволи для мікрофона
```
Windows Settings → Privacy → Microphone → Allow apps to access microphone
```

### 3. Дозволи для геолокації
```
Windows Settings → Privacy → Location → Allow apps to access location
```

### 4. Налаштування сповіщень
```
Windows Settings → System → Notifications & actions → Psychology of Power
```

## 🐛 Відомі проблеми на Windows

### Проблема: Камера не працює
**Рішення:**
```javascript
// Перевірка дозволів в налаштуваннях Windows
const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera error:', error);
    return false;
  }
};
```

### Проблема: Високе використання CPU
**Рішення:**
- Зменшити якість відео
- Вимкнути непотрібні анімації
- Використовувати hardware acceleration

### Проблема: PWA не встановлюється
**Рішення:**
- Перевірити HTTPS (для production)
- Очистити кеш браузера
- Спробувати інший браузер

## 📱 Тестування на різних конфігураціях

### Ноутбуки
- [ ] **Старі ноутбуки** (4GB RAM, i3)
- [ ] **Середні ноутбуки** (8GB RAM, i5)
- [ ] **Нові ноутбуки** (16GB RAM, i7)

### Монітори
- [ ] **HD** (1366x768)
- [ ] **Full HD** (1920x1080)
- [ ] **4K** (3840x2160)
- [ ] **Dual monitor** - перевірка поведінки

### Windows версії
- [ ] **Windows 10** (1903+)
- [ ] **Windows 11** (21H2+)

## 🚨 Стрес-тестування

### Навантаження на систему
```javascript
// Створення 100+ інцидентів
for (let i = 0; i < 100; i++) {
  await createIncident({
    video: largeVideoBlob,
    location: randomLocation,
    timestamp: new Date()
  });
}
```

### Тестування пам'яті
```javascript
// Моніторинг використання пам'яті
setInterval(() => {
  if (performance.memory) {
    console.log('Memory usage:', performance.memory.usedJSHeapSize);
  }
}, 5000);
```

## 📋 Фінальний чек-лист

### Після тестування:
- [ ] Всі основні функції працюють
- [ ] PWA встановлюється коректно
- [ ] Продуктивність прийнятна
- [ ] UI адаптивний на всіх розмірах
- [ ] Windows інтеграція працює
- [ ] Помилки відсутні в консолі
- [ ] Дані зберігаються коректно

### Перед релізом:
- [ ] Тестування на Windows 10/11
- [ ] Тестування в Chrome/Edge/Firefox
- [ ] Перевірка безпеки даних
- [ ] Оптимізація продуктивності
- [ ] Тестування оновлень PWA

---

## 🎉 Готово до тестування!

**Додаток повністю оптимізований для Windows ноутбуків!**

### Ключові переваги:
- **🖥️ Native Windows feel** - Segoe UI, Windows стилі
- **⚡ Висока продуктивність** - оптимізація для різних конфігурацій
- **🔗 Глибока інтеграція** - системні сповіщення, файлова система
- **⌨️ Зручність** - клавіатурні скорочення, контекстне меню
- **🎨 Адаптивність** - темна/світла тема, різні розміри

**Починайте тестування з `npm run dev`!** 🚀
