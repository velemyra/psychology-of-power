// Скрипт для створення іконок через Node.js
const fs = require('fs');
const path = require('path');

// Функція для створення SVG іконки
function createSVGIcon(size, style = 1) {
    const colors = {
        primary: '#FF6B35',
        secondary: '#667eea',
        background: '#ffffff',
        text: '#000000'
    };

    let svg = '';

    if (style === 1) {
        // Мінімалістичний стиль
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${colors.background}"/>
            <circle cx="${size/2}" cy="${size/2}" r="${size * 0.4}" fill="${colors.primary}"/>
            <text x="${size/2}" y="${size/2}" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${colors.text}">ПС</text>
        </svg>`;
    } else if (style === 2) {
        // Стиль щита
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${colors.background}"/>
            <path d="M ${size * 0.2} ${size * 0.1} L ${size * 0.8} ${size * 0.1} L ${size * 0.8} ${size * 0.6} L ${size * 0.5} ${size * 0.9} L ${size * 0.2} ${size * 0.6} Z" fill="${colors.primary}"/>
            <text x="${size/2}" y="${size * 0.4}" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${colors.text}">ПС</text>
        </svg>`;
    } else if (style === 3) {
        // Стиль ваги
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${colors.background}"/>
            <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="${colors.primary}"/>
            <text x="${size/2}" y="${size * 0.3}" font-family="Arial, sans-serif" font-size="${size * 0.2}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${colors.text}">ПС</text>
            <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" stroke="${colors.text}" stroke-width="${size * 0.05}"/>
        </svg>`;
    } else if (style === 4) {
        // Стиль закону/книги
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${colors.background}"/>
            <rect x="${size * 0.15}" y="${size * 0.2}" width="${size * 0.7}" height="${size * 0.6}" fill="${colors.primary}"/>
            <text x="${size/2}" y="${size * 0.25}" font-family="Arial, sans-serif" font-size="${size * 0.15}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${colors.text}">ПС</text>
            <line x1="${size * 0.2}" y1="${size * 0.4}" x2="${size * 0.8}" y2="${size * 0.4}" stroke="${colors.text}" stroke-width="${size * 0.02}"/>
            <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" stroke="${colors.text}" stroke-width="${size * 0.02}"/>
            <line x1="${size * 0.2}" y1="${size * 0.6}" x2="${size * 0.8}" y2="${size * 0.6}" stroke="${colors.text}" stroke-width="${size * 0.02}"/>
        </svg>`;
    }

    return svg;
}

// Функція для створення favicon
function createFavicon() {
    return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="#FF6B35"/>
        <text x="16" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">ПС</text>
    </svg>`;
}

// Створення всіх іконок
function createAllIcons() {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const iconsDir = path.join(__dirname);

    // Створення основних іконок
    sizes.forEach(size => {
        const svg = createSVGIcon(size, 1);
        fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
        console.log(`Створено icon-${size}x${size}.svg`);
    });

    // Створення favicon
    const favicon = createFavicon();
    fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), favicon);
    console.log('Створено favicon.svg');

    // Створення спеціальних іконок
    const specialIcons = [
        { name: 'sos', size: 96, style: 2 },
        { name: 'incidents', size: 96, style: 3 },
        { name: 'complaints', size: 96, style: 4 },
        { name: 'fines', size: 96, style: 1 }
    ];

    specialIcons.forEach(icon => {
        const svg = createSVGIcon(icon.size, icon.style);
        fs.writeFileSync(path.join(iconsDir, `${icon.name}-96x96.svg`), svg);
        console.log(`Створено ${icon.name}-96x96.svg`);
    });

    console.log('✅ Всі іконки створено успішно!');
}

// Створення HTML файлу для перегляду іконок
function createIconPreview() {
    const html = `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Перегляд іконок - ПСИХОЛОГІЯ СИЛИ</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        h1 { color: #FF6B35; text-align: center; margin-bottom: 30px; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .icon-item { text-align: center; padding: 20px; border: 2px solid #e0e0e0; border-radius: 10px; transition: transform 0.3s ease; }
        .icon-item:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .icon-item img { max-width: 100%; height: auto; border-radius: 8px; }
        .icon-item h3 { margin: 10px 0; color: #333; }
        .icon-item p { color: #666; font-size: 14px; }
        .download-btn { background: #FF6B35; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px; }
        .download-btn:hover { background: #e55a2b; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Іконки для "ПСИХОЛОГІЯ СИЛИ"</h1>
        
        <div class="icon-grid">
            <div class="icon-item">
                <img src="icon-72x72.svg" alt="72x72">
                <h3>72x72</h3>
                <p>Для Android launcher</p>
                <button class="download-btn" onclick="downloadIcon('icon-72x72.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-96x96.svg" alt="96x96">
                <h3>96x96</h3>
                <p>Для Google Play</p>
                <button class="download-btn" onclick="downloadIcon('icon-96x96.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-128x128.svg" alt="128x128">
                <h3>128x128</h3>
                <p>Для Chrome Web Store</p>
                <button class="download-btn" onclick="downloadIcon('icon-128x128.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-144x144.svg" alt="144x144">
                <h3>144x144</h3>
                <p>Для Windows Store</p>
                <button class="download-btn" onclick="downloadIcon('icon-144x144.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-152x152.svg" alt="152x152">
                <h3>152x152</h3>
                <p>Для iOS</p>
                <button class="download-btn" onclick="downloadIcon('icon-152x152.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-192x192.svg" alt="192x192">
                <h3>192x192</h3>
                <p>Для PWA manifest</p>
                <button class="download-btn" onclick="downloadIcon('icon-192x192.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-384x384.svg" alt="384x384">
                <h3>384x384</h3>
                <p>Для high-res displays</p>
                <button class="download-btn" onclick="downloadIcon('icon-384x384.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="icon-512x512.svg" alt="512x512">
                <h3>512x512</h3>
                <p>Для App Store</p>
                <button class="download-btn" onclick="downloadIcon('icon-512x512.svg')">Завантажити</button>
            </div>
        </div>
        
        <h2>🎯 Спеціальні іконки</h2>
        <div class="icon-grid">
            <div class="icon-item">
                <img src="sos-96x96.svg" alt="SOS">
                <h3>SOS</h3>
                <p>Для екстреного режиму</p>
                <button class="download-btn" onclick="downloadIcon('sos-96x96.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="incidents-96x96.svg" alt="Incidents">
                <h3>Інциденти</h3>
                <p>Для розділу інцидентів</p>
                <button class="download-btn" onclick="downloadIcon('incidents-96x96.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="complaints-96x96.svg" alt="Complaints">
                <h3>Скарги</h3>
                <p>Для генератора скарг</p>
                <button class="download-btn" onclick="downloadIcon('complaints-96x96.svg')">Завантажити</button>
            </div>
            
            <div class="icon-item">
                <img src="fines-96x96.svg" alt="Fines">
                <h3>Штрафи</h3>
                <p>Для калькулятора штрафів</p>
                <button class="download-btn" onclick="downloadIcon('fines-96x96.svg')">Завантажити</button>
            </div>
        </div>
    </div>
    
    <script>
        function downloadIcon(filename) {
            const link = document.createElement('a');
            link.href = filename;
            link.download = filename;
            link.click();
        }
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, 'icon-preview.html'), html);
    console.log('Створено icon-preview.html');
}

// Виконання функцій
if (require.main === module) {
    createAllIcons();
    createIconPreview();
}

module.exports = { createSVGIcon, createFavicon, createAllIcons, createIconPreview };
