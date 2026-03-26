import React, { useState } from 'react'
import { Calculator, AlertCircle, DollarSign } from 'lucide-react'

const FineCalculator = ({ userSubscription }) => {
  const [calculatedFine, setCalculatedFine] = useState(null)

  const fines = [
    {
      id: 1,
      title: 'Перевищення швидкості на 10-20 км/год',
      fine: 340,
      description: 'Стаття 122 КУпАП',
      points: 2
    },
    {
      id: 2,
      title: 'Перевищення швидкості на 20-50 км/год',
      fine: 510,
      description: 'Стаття 122 КУпАП',
      points: 3
    },
    {
      id: 3,
      title: 'Парковка в забороненому місці',
      fine: 255,
      description: 'Стаття 152 КУпАП',
      points: 1
    }
  ]

  const calculateFine = (fine) => {
    const penaltyDays = Math.floor(Math.random() * 30) + 1
    const penalty = Math.round(fine.fine * 0.01 * penaltyDays)
    const total = fine.fine + penalty
    
    setCalculatedFine({
      ...fine,
      penaltyDays,
      penalty,
      total
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div className="container">
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: 'var(--primary-color)',
            marginBottom: '30px',
            textAlign: 'center',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <Calculator size={40} />
            Калькулятор штрафів
          </h2>

          {calculatedFine && (
            <div style={{
              background: 'var(--success-color)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Розрахунок штрафу</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div>Штраф: {calculatedFine.fine} грн</div>
                <div>Пеня ({calculatedFine.penaltyDays} днів): {calculatedFine.penalty} грн</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Всього до сплати: {calculatedFine.total} грн
                </div>
              </div>
              <button
                onClick={() => setCalculatedFine(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  color: 'white',
                  marginTop: '15px',
                  cursor: 'pointer'
                }}
              >
                Закрити
              </button>
            </div>
          )}

          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {fines.map(fine => (
              <div key={fine.id} style={{
                background: 'var(--light-color)',
                borderRadius: '12px',
                padding: '20px',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: '0 0 10px 0',
                      color: 'var(--dark-color)',
                      fontSize: '1.1rem'
                    }}>
                      {fine.title}
                    </h4>
                    <p style={{
                      margin: '0 0 10px 0',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {fine.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <DollarSign size={14} />
                        {fine.fine} грн
                      </span>
                      <span>
                        Балів: {fine.points}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => calculateFine(fine)}
                    className="btn btn-primary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Розрахувати
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--warning-color)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span>
              Суми штрафів актуальні на 2024 рік. Фактична сума може включати судові збори.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FineCalculator
