import React, { useState, useEffect } from 'react'
import { finesDatabase, searchFines, getFinesByCategory, getCategories } from '../utils/finesDatabase'

const FineCalculator = ({ userSubscription }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('всі')
  const [filteredFines, setFilteredFines] = useState(finesDatabase)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [selectedFines, setSelectedFines] = useState([])

  const categories = ['всі', ...getCategories()]

  useEffect(() => {
    let result = finesDatabase
    
    if (selectedCategory !== 'всі') {
      result = getFinesByCategory(selectedCategory)
    }
    
    if (searchQuery) {
      result = searchFines(searchQuery)
    }
    
    setFilteredFines(result)
  }, [searchQuery, selectedCategory])

  const toggleFineSelection = (fine) => {
    const isSelected = selectedFines.find(f => f.id === fine.id)
    
    if (isSelected) {
      const newSelected = selectedFines.filter(f => f.id !== fine.id)
      setSelectedFines(newSelected)
      updateTotals(newSelected)
    } else {
      const newSelected = [...selectedFines, fine]
      setSelectedFines(newSelected)
      updateTotals(newSelected)
    }
  }

  const updateTotals = (fines) => {
    const total = fines.reduce((sum, fine) => sum + fine.amount, 0)
    const points = fines.reduce((sum, fine) => sum + fine.points, 0)
    setTotalAmount(total)
    setTotalPoints(points)
  }

  const clearSelection = () => {
    setSelectedFines([])
    setTotalAmount(0)
    setTotalPoints(0)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'var(--gold-medium)'
      case 'medium': return 'var(--warning-color)'
      case 'high': return 'var(--primary-color)'
      case 'critical': return '#8B0000'
      default: return 'var(--secondary-color)'
    }
  }

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'low': return 'Низький'
      case 'medium': return 'Середній'
      case 'high': return 'Високий'
      case 'critical': return 'Критичний'
      default: return 'Невідомо'
    }
  }

  const isFineSelected = (fineId) => {
    return selectedFines.find(f => f.id === fineId)
  }

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, #000000, #1A1A1A)',
        borderRadius: '16px',
        padding: '30px',
        color: 'var(--text-primary)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '30px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
        }}>
          📋 База Штрафів України
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '30px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          lineHeight: '1.6'
        }}>
          Повний перелік штрафів ПДР з сумами, балами та описами. Оберіть штрафи для розрахунку загальної суми.
        </p>

        <div style={{
          background: 'var(--light-color)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          border: '1px solid var(--gold-medium)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontWeight: 'bold'
              }}>
                🔍 Пошук штрафу:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введіть опис, категорію або статтю..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--gold-medium)',
                  background: 'var(--dark-color)',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-secondary)',
                fontWeight: 'bold'
              }}>
                📂 Категорія:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--gold-medium)',
                  background: 'var(--dark-color)',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedFines.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, var(--success-color), var(--success-dark))',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            border: '2px solid var(--success-color)',
            boxShadow: 'var(--shadow-green)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-on-gold)',
                  marginBottom: '5px'
                }}>
                  📄 Кількість штрафів
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--text-on-gold)'
                }}>
                  {selectedFines.length}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-on-gold)',
                  marginBottom: '5px'
                }}>
                  💰 Загальна сума
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--text-on-gold)'
                }}>
                  ₴{totalAmount.toLocaleString('uk-UA')}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-on-gold)',
                  marginBottom: '5px'
                }}>
                  ⭐ Загальні бали
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'var(--text-on-gold)'
                }}>
                  {totalPoints}
                </div>
              </div>
            </div>
            
            <button
              onClick={clearSelection}
              className="btn btn-danger"
              style={{
                marginTop: '20px',
                width: '100%'
              }}
            >
              🗑️ Очистити вибір
            </button>
          </div>
        )}

        <div style={{
          background: 'var(--light-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--gold-medium)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            color: 'var(--text-secondary)'
          }}>
            📋 Список штрафів ({filteredFines.length})
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            {filteredFines.map(fine => {
              const isSelected = isFineSelected(fine.id)
              return (
                <div
                  key={fine.id}
                  onClick={() => toggleFineSelection(fine)}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, var(--success-color), var(--success-dark))'
                      : 'linear-gradient(135deg, #000000, #1A1A1A)',
                    border: isSelected 
                      ? '2px solid var(--success-color)'
                      : '2px solid var(--gold-medium)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected 
                      ? 'var(--shadow-green)'
                      : 'var(--shadow)',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                      <div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-primary)',
                          marginBottom: '5px'
                        }}>
                          {fine.description}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-muted)'
                        }}>
                          {fine.article}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-muted)',
                          marginBottom: '3px'
                        }}>
                          Категорія
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-secondary)'
                        }}>
                          {fine.category}
                        </div>
                      </div>
                      
                      <div style={{
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-muted)',
                          marginBottom: '3px'
                        }}>
                          Сума
                        </div>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-secondary)'
                        }}>
                          ₴{fine.amount}
                        </div>
                      </div>
                      
                      <div style={{
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-muted)',
                          marginBottom: '3px'
                        }}>
                          Бали
                        </div>
                        <div style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-secondary)'
                        }}>
                          {fine.points}
                        </div>
                      </div>
                      
                      <div style={{
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: isSelected ? 'var(--text-on-gold)' : 'var(--text-muted)',
                          marginBottom: '3px'
                        }}>
                          Рівень
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: getSeverityColor(fine.severity),
                          color: 'white'
                        }}>
                          {getSeverityText(fine.severity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{
          background: 'var(--light-color)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '30px',
          border: '1px solid var(--gold-medium)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            marginBottom: '15px',
            color: 'var(--text-secondary)'
          }}>
            📖 Як користуватися:
          </h3>
          <ul style={{
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Використовуйте пошук для знаходження конкретних штрафів</li>
            <li>Фільтруйте за категоріями для швидкого доступу</li>
            <li>Оберіть штрафи, щоб розрахувати загальну суму</li>
            <li>Бали показують кількість штрафних балів</li>
            <li>Рівень важливості показує серйозність порушення</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FineCalculator
