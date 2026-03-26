import React from 'react'

const Menu = ({ userSubscription, onEmergencyActivate }) => {
  return (
    <div className="container">
      <div style={{
        background: 'rgba(28, 28, 28, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        marginTop: '20px',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          marginBottom: '30px',
          textAlign: 'center',
          color: 'var(--gold-medium)'
        }}>
          📱 МЕНЮ
        </h2>
        
        <div style={{
          display: 'grid',
          gap: '15px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            🏠 Головна
          </button>
          
          <button
            onClick={() => window.location.href = '/incidents'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            📹 Інциденти
          </button>
          
          <button
            onClick={() => window.location.href = '/complaints'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            📝 Скарги
          </button>
          
          <button
            onClick={() => window.location.href = '/evidence'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            📸 Докази
          </button>
          
          <button
            onClick={() => window.location.href = '/fines'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            💰 Штрафи
          </button>
          
          <button
            onClick={() => window.location.href = '/road-signs'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            🚦 Знаки
          </button>
          
          <button
            onClick={() => window.location.href = '/legal-help'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ⚖️ Допомога
          </button>
          
          <button
            onClick={() => window.location.href = '/profile'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            👤 Профіль
          </button>
        </div>
        
        {/* SOS Button */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <button
            onClick={onEmergencyActivate}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              padding: '20px 40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-color), #B91C1C)',
              color: 'white',
              border: '2px solid var(--gold-medium)',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '200px'
            }}
          >
            <span style={{ textAlign: 'center', lineHeight: '1.2' }}>
              🚨 ЕКСТРЕНИЙ РЕЖИМ
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Menu
