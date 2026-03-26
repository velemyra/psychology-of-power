# 🎨 Іконки для "ПСИХОЛОГІЯ СИЛИ"

## Опис набору іконок

Професійний набір іконок для PWA додатку "ПСИХОЛОГІЯ СИЛИ", створений у відповідності до вимог різних платформ та розмірів.

## 📁 Структура файлів

```
icons/
├── icon-72x72.svg          # Android launcher
├── icon-96x96.svg          # Google Play Store
├── icon-128x128.svg        # Chrome Web Store
├── icon-144x144.svg        # Windows Store
├── icon-152x152.svg        # iOS App Store
├──-icon-192x192.svg        # PWA manifest (основна)
├── icon-384x384.svg        # High-res displays
├── icon-512x512.svg        # App Store (основна)
├── favicon.svg              # Browser tab
├── sos-96x96.svg           # SOS button
├── incidents-96x96.svg      # Incidents section
├── complaints-96x96.svg    # Complaints section
├── fines-96x96.svg         # Fines calculator
├── icon-generator.html      # Генератор іконок
├── create-icons.js         # Node.js скрипт
└── README.md              # Цей файл
```

## 🎨 Дизайн стилі

### Основна іконка
- **Колір:** #FF6B35 (помаранчевий) - символізує екстрену ситуацію
- **Текст:** "ПС" - абревіатура назви
- **Стиль:** Мінімалістичний з юридичними елементами
- **Фон:** Білий для кращої видимості

### Спеціальні іконки
- **SOS:** Червоний (#dc2626) з хвилями сигналу
- **Інциденти:** Синій (#667eea) з камерою та локацією
- **Скарги:** Фіолетовий (#764ba2) з документом та печаткою
- **Штрафи:** Жовтий (#f59e0b) з символом гривні

## 🛠️ Інструменти

### 1. Генератор іконок (Browser)
Відкрийте `icon-generator.html` в браузері для:
- Налаштування кольорів
- Зміни тексту
- Попереднього перегляду
- Завантаження всіх розмірів

### 2. Node.js скрипт
Запустіть для автоматичного створення:
```bash
node create-icons.js
```

### 3. Онлайн перегляд
Відкрийте `icon-preview.html` для перегляду всіх іконок

## 📱 Платформи та вимоги

### PWA (Progressive Web App)
- **192x192** - основна іконка для manifest.json
- **512x512** - для high-res дисплеїв
- **SVG** - для кращої якості на всіх розмірах

### iOS
- **152x152** - iPhone/iPad
- **167x167** - iPhone Plus
- **180x180** - iPhone Pro

### Android
- **72x72** - старі версії
- **96x96** - стандарт
- **144x144** - high-res
- **192x192** - adaptive icons

### Stores
- **128x128** - Chrome Web Store
- **144x144** - Windows Store
- **512x512** - App Store
- **1024x1024** - Google Play (потрібно створити)

## 🎯 Використання

### В маніфесті PWA
```json
{
  "icons": [
    {
      "src": "icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512x512.svg", 
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

### В HTML
```html
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/icon-152x152.svg">
```

### В React компонентах
```jsx
import sosIcon from '../icons/sos-96x96.svg';
import incidentsIcon from '../icons/incidents-96x96.svg';

<img src={sosIcon} alt="SOS" />
<img src={incidentsIcon} alt="Інциденти" />
```

## 🔧 Кастомізація

### Зміна кольорів
Редагуйте значення в SVG файлах:
```xml
fill="#FF6B35"  <!-- основний колір -->
fill="#ffffff"  <!-- текстовий колір -->
```

### Зміна тексту
Змініть текстовий елемент в SVG:
```xml
<text x="96" y="96" font-size="48" fill="#ffffff">ВАШ ТЕКСТ</text>
```

### Додавання нових іконок
1. Скопіюйте існуючий SVG файл
2. Змініть розмір у `viewBox` та `width/height`
3. Адаптуйте дизайн під новий розмір
4. Додайте в manifest.json

## 📏 Розміри та специфікації

| Розмір | Призначення | Платформа |
|--------|-------------|-----------|
| 32x32 | Favicon | Browser |
| 72x72 | Launcher | Android |
| 96x96 | Store | Google Play |
| 128x128 | Store | Chrome |
| 144x144 | Store | Windows |
| 152x152 | Launcher | iOS |
| 167x167 | Launcher | iOS Plus |
| 180x180 | Launcher | iOS Pro |
| 192x192 | PWA | Manifest |
| 384x384 | High-res | PWA |
| 512x512 | Store | App Store |
| 1024x1024 | Store | Google Play |

## 🚀 Оптимізація

### SVG оптимізація
- Використовуйте `svgo` для стиснення:
```bash
npx svgo icons/*.svg
```

### Конвертація в PNG
```bash
# Для платформ, що не підтримують SVG
for file in *.svg; do
  rsvg-convert "$file" -o "${file%.svg}.png"
done
```

### Стиснення PNG
```bash
# Оптимізація PNG файлів
npx imagemin icons/*.png --out-dir=optimized/
```

## 🔍 Перевірка якості

### Інструменти
- [PWA Builder](https://www.pwabuilder.com/) - перевірка PWA
- [Favicon Checker](https://realfavicongenerator.net/) - перевірка favicon
- [App Icon Generator](https://appicon.co/) - генерація для мобільних

### Тестування
1. Перевірте відображення на різних пристроях
2. Перевірте читабельність на малих розмірах
3. Перевірте контрастність на різних фонах

## 📝 Ліцензія

Всі іконки створені для "ПСИХОЛОГІЯ СИЛИ" і підлягають ліцензії проєкту.

---

**💡 Порада:** Використовуйте SVG формат для кращої якості та адаптивності на всіх розмірах екрану!
