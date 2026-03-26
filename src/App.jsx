import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import EmergencyMode from './components/EmergencyMode'
import Incidents from './components/Incidents'
import ComplaintGenerator from './components/ComplaintGenerator'
import Evidence from './components/Evidence'
import FineCalculator from './components/FineCalculator'
import RoadSigns from './components/RoadSigns'
import LegalHelp from './components/LegalHelp'
import Profile from './components/Profile'
import SubscriptionModal from './components/SubscriptionModal'
import Menu from './components/Menu'
import { initDB } from './utils/db'
import { checkSubscription } from './utils/subscription'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [userSubscription, setUserSubscription] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize database
    initDB()
    
    // Check subscription status
    const subscription = checkSubscription()
    setUserSubscription(subscription)
    
    // Online/offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleEmergencyActivate = () => {
    navigate('/emergency')
  }

  const handleSubscriptionUpgrade = () => {
    setShowSubscriptionModal(true)
  }

  return (
    <div className="app">
      <Header 
        onEmergencyActivate={handleEmergencyActivate}
        onSubscriptionUpgrade={handleSubscriptionUpgrade}
        userSubscription={userSubscription}
        isOnline={isOnline}
      />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onEmergencyActivate={handleEmergencyActivate} />} />
          <Route path="/emergency" element={<EmergencyMode />} />
          <Route path="/incidents" element={<Incidents userSubscription={userSubscription} />} />
          <Route path="/complaints" element={<ComplaintGenerator userSubscription={userSubscription} />} />
          <Route path="/evidence" element={<Evidence userSubscription={userSubscription} />} />
          <Route path="/fines" element={<FineCalculator />} />
          <Route path="/road-signs" element={<RoadSigns />} />
          <Route path="/legal-help" element={<LegalHelp />} />
          <Route path="/profile" element={<Profile userSubscription={userSubscription} onSubscriptionUpgrade={handleSubscriptionUpgrade} />} />
          <Route path="/menu" element={<Menu userSubscription={userSubscription} onEmergencyActivate={handleEmergencyActivate} />} />
        </Routes>
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          currentSubscription={userSubscription}
        />
      )}
    </div>
  )
}

function Home({ onEmergencyActivate }) {
  return (
    <div className="container">
      <div className="text-center mb-20">
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '20px' }}>
          ПСИХОЛОГІЯ СИЛИ
        </h1>
        <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '30px' }}>
          Ваш надійний захист при спілкуванні з поліцією
        </p>
        
        <button 
          className="sos-button"
          onClick={onEmergencyActivate}
          style={{ margin: '0 auto 40px' }}
        >
          🚨 SOS
        </button>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>📹 Інциденти</h3>
          <p>Перегляньте всі зафіксовані випадки</p>
          <a href="/incidents" className="btn btn-primary">Переглянути</a>
        </div>

        <div className="card">
          <h3>📝 Генератор скарг</h3>
          <p>Створіть юридично обґрунтовані скарги</p>
          <a href="/complaints" className="btn btn-secondary">Створити</a>
        </div>

        <div className="card">
          <h3>📂 Докази</h3>
          <p>Зберігайте та відправляйте докази</p>
          <a href="/evidence" className="btn btn-success">Відкрити</a>
        </div>

        <div className="card">
          <h3>💰 Калькулятор штрафів</h3>
          <p>Дізнайтеся суми штрафів за ПДР</p>
          <a href="/fines" className="btn btn-outline">Розрахувати</a>
        </div>

        <div className="card">
          <h3>🚦 Дорожні знаки</h3>
          <p>Розпізнавання знаків через камеру</p>
          <a href="/road-signs" className="btn btn-outline">Сканувати</a>
        </div>

        <div className="card">
          <h3>⚖️ Юридична допомога</h3>
          <p>Консультації та поради юристів</p>
          <a href="/legal-help" className="btn btn-outline">Отримати</a>
        </div>
      </div>
    </div>
  )
}

export default App
