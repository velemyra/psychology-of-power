// Повна база даних штрафів України з описами, сумами та балами
export const finesDatabase = [
  // Рух та паркування
  {
    id: 1,
    category: "Швидкість",
    description: "Перевищення швидкості на 10-20 км/год",
    amount: 340,
    points: 3,
    article: "122 КУпАП",
    severity: "medium"
  },
  {
    id: 2,
    category: "Швидкість",
    description: "Перевищення швидкості на 20-50 км/год",
    amount: 510,
    points: 4,
    article: "122 КУпАП",
    severity: "high"
  },
  {
    id: 3,
    category: "Швидкість",
    description: "Перевищення швидкості понад 50 км/год",
    amount: 680,
    points: 5,
    article: "122 КУпАП",
    severity: "critical"
  },
  {
    id: 4,
    category: "Паркування",
    description: "Порушення правил паркування",
    amount: 255,
    points: 2,
    article: "152 КУпАП",
    severity: "low"
  },
  {
    id: 5,
    category: "Паркування",
    description: "Паркування на місці для інвалідів",
    amount: 1020,
    points: 5,
    article: "128 КУпАП",
    severity: "high"
  },
  
  // ПДР та документи
  {
    id: 6,
    category: "Документи",
    description: "Відсутність водійського посвідчення",
    amount: 425,
    points: 3,
    article: "126 КУпАП",
    severity: "medium"
  },
  {
    id: 7,
    category: "Документи",
    description: "Відсутність страхового поліса",
    amount: 425,
    points: 3,
    article: "126 КУпАП",
    severity: "medium"
  },
  {
    id: 8,
    category: "Документи",
    description: "Керування транспортним засобом особою, яка не має права керування",
    amount: 850,
    points: 5,
    article: "126 КУпАП",
    severity: "high"
  },
  
  // Алкоголь та наркотики
  {
    id: 9,
    category: "Алкоголь",
    description: "Керування в стані сп'яніння (0.2-0.5 проміле)",
    amount: 10200,
    points: 10,
    article: "130 КУпАП",
    severity: "critical"
  },
  {
    id: 10,
    category: "Алкоголь",
    description: "Керування в стані сп'яніння (понад 0.5 проміле)",
    amount: 17000,
    points: 10,
    article: "130 КУпАП",
    severity: "critical"
  },
  {
    id: 11,
    category: "Алкоголь",
    description: "Відмова від проходження огляду на стан сп'яніння",
    amount: 40800,
    points: 10,
    article: "130 КУпАП",
    severity: "critical"
  },
  
  // Порушення ПДР
  {
    id: 12,
    category: "ПДР",
    description: "Проїзд на заборонений сигнал світлофора",
    amount: 425,
    points: 3,
    article: "124 КУпАП",
    severity: "medium"
  },
  {
    id: 13,
    category: "ПДР",
    description: "Порушення правил проїзду перехрестя",
    amount: 255,
    points: 2,
    article: "124 КУпАП",
    severity: "low"
  },
  {
    id: 14,
    category: "ПДР",
    description: "Виїзд на смугу зустрічного руху",
    amount: 425,
    points: 3,
    article: "124 КУпАП",
    severity: "medium"
  },
  {
    id: 15,
    category: "ПДР",
    description: "Неправильне розташування на дорозі",
    amount: 85,
    points: 1,
    article: "122 КУпАП",
    severity: "low"
  },
  
  // Технічний стан
  {
    id: 16,
    category: "Техстан",
    description: "Керування несправним транспортним засобом",
    amount: 425,
    points: 3,
    article: "121 КУпАП",
    severity: "medium"
  },
  {
    id: 17,
    category: "Техстан",
    description: "Відсутність або несправність світлових приладів",
    amount: 340,
    points: 2,
    article: "122 КУпАП",
    severity: "medium"
  },
  
  // Телефон та відволікання
  {
    id: 18,
    category: "Відволікання",
    description: "Користування телефоном під час руху",
    amount: 425,
    points: 3,
    article: "122 КУпАП",
    severity: "medium"
  },
  {
    id: 19,
    category: "Відволікання",
    description: "Користування телефоном без hands-free",
    amount: 510,
    points: 4,
    article: "122 КУпАП",
    severity: "high"
  },
  
  // Пасажири та вантаж
  {
    id: 20,
    category: "Пасажири",
    description: "Перевезення непристебнутих пасажирів",
    amount: 255,
    points: 2,
    article: "121 КУпАП",
    severity: "low"
  },
  {
    id: 21,
    category: "Пасажири",
    description: "Перевезення дітей без автокрісла",
    amount: 510,
    points: 4,
    article: "121 КУпАП",
    severity: "high"
  },
  {
    id: 22,
    category: "Вантаж",
    description: "Перевантаження транспортного засобу",
    amount: 340,
    points: 2,
    article: "121 КУпАП",
    severity: "medium"
  },
  
  // Пішоходи та велосипедисти
  {
    id: 23,
    category: "Пішоходи",
    description: "Не надання переваги пішоходу",
    amount: 425,
    points: 3,
    article: "124 КУпАП",
    severity: "medium"
  },
  {
    id: 24,
    category: "Пішоходи",
    description: "Проїзд по пішохідному переходу",
    amount: 255,
    points: 2,
    article: "124 КУпАП",
    severity: "low"
  },
  
  // Дорожні знаки
  {
    id: 25,
    category: "Знаки",
    description: "Ігнорування дорожнього знаку",
    amount: 340,
    points: 2,
    article: "122 КУпАП",
    severity: "medium"
  },
  {
    id: 26,
    category: "Знаки",
    description: "Проїзд під знаком 'Кінець зони обмеження'",
    amount: 425,
    points: 3,
    article: "122 КУпАП",
    severity: "medium"
  },
  
  // Зупинки та стоянки
  {
    id: 27,
    category: "Зупинки",
    description: "Зупинка в забороненому місці",
    amount: 85,
    points: 1,
    article: "122 КУпАП",
    severity: "low"
  },
  {
    id: 28,
    category: "Зупинки",
    description: "Стоянка в забороненому місці",
    amount: 255,
    points: 2,
    article: "122 КУпАП",
    severity: "low"
  },
  
  // Обгін
  {
    id: 29,
    category: "Обгін",
    description: "Обгін з порушенням ПДР",
    amount: 425,
    points: 3,
    article: "122 КУпАП",
    severity: "medium"
  },
  {
    id: 30,
    category: "Обгін",
    description: "Обгін на перехресті",
    amount: 510,
    points: 4,
    article: "122 КУпАП",
    severity: "high"
  },
  
  // Документи на транспорт
  {
    id: 31,
    category: "Реєстрація",
    description: "Відсутність реєстрації транспортного засобу",
    amount: 170,
    points: 1,
    article: "121 КУпАП",
    severity: "low"
  },
  {
    id: 32,
    category: "Реєстрація",
    description: "Несвоєчасна реєстрація транспортного засобу",
    amount: 85,
    points: 1,
    article: "121 КУпАП",
    severity: "low"
  }
]

// Функції для пошуку та фільтрації
export const searchFines = (query) => {
  if (!query) return finesDatabase
  
  const lowerQuery = query.toLowerCase()
  return finesDatabase.filter(fine => 
    fine.description.toLowerCase().includes(lowerQuery) ||
    fine.category.toLowerCase().includes(lowerQuery) ||
    fine.article.toLowerCase().includes(lowerQuery)
  )
}

export const getFinesByCategory = (category) => {
  return finesDatabase.filter(fine => fine.category === category)
}

export const getFinesBySeverity = (severity) => {
  return finesDatabase.filter(fine => fine.severity === severity)
}

export const getTotalFines = () => {
  return finesDatabase.length
}

export const getCategories = () => {
  return [...new Set(finesDatabase.map(fine => fine.category))]
}

export const getFineById = (id) => {
  return finesDatabase.find(fine => fine.id === id)
}
