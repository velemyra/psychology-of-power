import React, { useState } from 'react'
import { Camera, Search, AlertCircle, Info } from 'lucide-react'

const RoadSigns = ({ userSubscription }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [detectedSign, setDetectedSign] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const roadSigns = [
    {
      id: 1,
      name: 'Зупинка заборонена',
      category: 'заборона',
      description: 'Забороняє зупинку транспортних засобів',
      image: '🚫',
      penalty: '255 грн'
    },
    {
      id: 2,
      name: 'Парковка заборонена',
      category: 'заборона',
      description: 'Забороняє стоянку транспортних засобів',
      image: '🅿️',
      penalty: '255 грн'
    },
    {
      id: 3,
      name: 'Обмеження швидкості 50 км/год',
      category: 'обмеження',
      description: 'Обмежує максимальну швидкість 50 км/год',
      image: '50',
      penalty: '340-510 грн'
    }
  ]

  const startScanning = () => {
    setIsScanning(true)
    setTimeout(() => {
      const randomSign = roadSigns[Math.floor(Math.random() * roadSigns.length)]
      setDetectedSign(randomSign)
      setIsScanning(false)
    }, 3000)
  }

  const filteredSigns = roadSigns.filter(sign =>
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            fontSize: '2rem'
          }}>
            🚦 Дорожні знаки
          </h2>

          <div style={{
            background: 'var(--light-color)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '20px'
            }}>
              Сканування дорожніх знаків
            </h3>
            
            {isScanning ? (
              <div>
                <div style={{
                  background: '#000',
                  height: '200px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '15px'
                }}>
                  <Camera size={48} />
                </div>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  Сканування...
                </p>
                <button
                  onClick={() => setIsScanning(false)}
                  className="btn btn-danger"
                >
                  Зупинити
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#f0f0f0',
                  height: '200px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  marginBottom: '15px'
                }}>
                  <Camera size={48} style={{ opacity: 0.3 }} />
                </div>
                <button
                  onClick={startScanning}
                  className="btn btn-primary"
                >
                  Почати сканування
                </button>
              </div>
            )}
          </div>

          {detectedSign && (
            <div style={{
              background: 'var(--success-color)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>
                Виявлено знак: {detectedSign.name}
              </h3>
              <p style={{ margin: '0 0 10px 0' }}>
                {detectedSign.description}
              </p>
              <p style={{ margin: '0', fontWeight: 'bold' }}>
                Штраф за порушення: {detectedSign.penalty}
              </p>
              <button
                onClick={() => setDetectedSign(null)}
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

          <div style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Пошук дорожніх знаків..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {filteredSigns.map(sign => (
              <div key={sign.id} style={{
                background: 'var(--light-color)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                  background: 'white',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px'
                }}>
                  {sign.image}
                </div>
                
                <h4 style={{
                  margin: '0 0 10px 0',
                  color: 'var(--dark-color)',
                  fontSize: '1.1rem'
                }}>
                  {sign.name}
                </h4>
                
                <p style={{
                  margin: '0 0 10px 0',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  {sign.description}
                </p>
                
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--primary-color)',
                  fontWeight: 'bold'
                }}>
                  Штраф: {sign.penalty}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoadSigns
