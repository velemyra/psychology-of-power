# 🚗 ПСИХОЛОГІЯ СИЛИ - PWA Додаток

## 📋 Що реалізовано

### ✅ Готові компоненти:
- **Header.jsx** - навігація з статусом онлайн/офлайн та підписками
- **EmergencyMode.jsx** - екстрений режим з відеозаписом та геолокацією  
- **Incidents.jsx** - управління інцидентами з фільтрацією
- **App.jsx** - головний компонент з роутингом
- **Profile.jsx** - профіль користувача з управлінням підписками
- **SubscriptionModal.jsx** - модальне вікно підписок
- **IndexedDB** - повна база даних для офлайн зберігання
- **Subscription system** - система підписок (Free, PRO, Premium)

### 🎯 Демо-версія:
Створено **demo.html** - повнофункціональна демо-версія, яку можна відкрити в будь-якому браузері без Node.js.

## 🚀 Як запустити

### Спосіб 1: Демо-версія (рекомендовано)
1. Відкрийте файл `demo.html` в браузері
2. Всі основні функції доступні одразу

### Спосіб 2: Повна версія (потрібен Node.js)
```bash
# Встановіть Node.js з https://nodejs.org/

# Встановіть залежності
npm install

# Запустіть розробку
npm run dev

# Відкрийте http://localhost:3000
```

## 📱 Основні функції

### 🚨 Екстрений режим
- **SOS кнопка** - миттєве активування
- **Відеозапис** - з фронтальної та основної камери
- **Геолокація** - автоматичне фіксування координат
- **Юридичні питання** - аудіо-кнопки з питаннями до поліції

### 📁 Інциденти
- Хронологічний список всіх записаних інцидентів
- Детальна інформація: відео, локація, час, нотатки
- Пошук та фільтрація
- Експорт та поширення

### 💾 Офлайн режим
- Повна робота без інтернету
- Автоматичне збереження в IndexedDB
- Синхронізація при підключенні

### 💰 Підписки
- **Free** - до 5 інцидентів на місяць
- **PRO** (99 грн/міс) - необмежено + хмара на 30 днів
- **Premium** (199 грн/міс) - все з PRO + консультації юристів

## 🛠 Технології

- **Frontend**: React 18 + Vite
- **PWA**: Service Worker, Manifest, Offline підтримка
- **База даних**: IndexedDB (офлайн) + Firebase (хмара)
- **Стилі**: CSS-in-JS, адаптивний дизайн
- **Іконки**: Lucide React

## 📲 PWA функції

- ✅ Встановлення на домашній екран
- ✅ Робота офлайн
- ✅ Push сповіщення
- ✅ Автономне кешування
- ✅ Background Sync
- ✅ Share Target API

## 🔧 Налаштування

### Environment Variables
Створіть файл `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📂 Структура проекту

```
psychology-of-power/
├── demo.html              # Демо-версія для тестування
├── src/
│   ├── components/        # React компоненти
│   │   ├── Header.jsx
│   │   ├── EmergencyMode.jsx
│   │   ├── Incidents.jsx
│   │   ├── Profile.jsx
│   │   └── SubscriptionModal.jsx
│   ├── utils/            # Утиліти
│   │   ├── db.js         # IndexedDB операції
│   │   └── subscription.js # Управління підписками
│   ├── App.jsx           # Головний компонент
│   ├── main.jsx          # Точка входу
│   └── index.css         # Глобальні стилі
├── public/
│   ├── manifest.json     # PWA маніфест
│   └── sw.js            # Service Worker
└── package.json
```

## 🌐 Деплой

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Firebase Hosting
```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy --only hosting
```

## 🔐 Безпека

- **Шифрування даних** - всі дані шифруються локально
- **Приватність** - анонімність при відправці скарг
- **Local storage** - дані зберігаються на пристрої

## 📈 Моніторинг

- Google Analytics для відстеження користувачів
- Sentry для відловлення помилок (опційно)

## 🤝 Внесок

1. Fork проєкту
2. Створіть гілку (`git checkout -b feature/AmazingFeature`)
3. Зробіть коміт (`git commit -m 'Add some AmazingFeature'`)
4. Пуш в гілку (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проєкт ліцензовано під MIT License.

## 🆘 Підтримка

- **Email**: support@psychology-of-power.com
- **Telegram**: @psychology_of_power

---

## 🎯 Що потрібно доробити

### 🔄 В процесі:
- [x] Базова структура додатку
- [x] EmergencyMode з відеозаписом
- [x] Система інцидентів
- [x] Підписки та профіль
- [x] IndexedDB для офлайн роботи
- [x] PWA функціонал
- [x] Демо-версія

### ⏳ Планові компоненти:
- [ ] Complaints.jsx - генератор скарг
- [ ] Evidence.jsx - управління доказами  
- [ ] FinesCalculator.jsx - калькулятор штрафів
- [ ] RoadSigns.jsx - сканування дорожніх знаків
- [ ] LegalHelp.jsx - юридична допомога

### 🔧 Технічні покращення:
- [ ] Firebase інтеграція
- [ ] Push сповіщення
- [ ] Автоматична синхронізація
- [ ] Тести для компонентів
- [ ] Оптимізація продуктивності

---

**© 2024 ПСИХОЛОГІЯ СИЛИ. Всі права захищено.**

*Захистимо ваші права на дорозі!* 🚗⚖️
