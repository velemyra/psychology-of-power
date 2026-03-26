import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import StatusBar from './components/StatusBar'
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
    // Initialize database with proper error handling
    const initializeDatabase = async () => {
      try {
        await initDB()
        console.log('✅ Database initialized successfully')
      } catch (error) {
        console.warn('⚠️ Database initialization failed, using fallback:', error)
        // Continue with fallback storage
      }
    }

    // Check subscription with error handling
    const checkUserSubscription = () => {
      try {
        const subscription = checkSubscription()
        setUserSubscription(subscription)
        console.log('✅ Subscription checked:', subscription.plan)
      } catch (error) {
        console.warn('⚠️ Subscription check failed:', error)
        setUserSubscription({ plan: 'free', status: 'active' })
      }
    }

    // Initialize everything
    initializeDatabase()
    checkUserSubscription()
    
    // Online/offline detection
    const handleOnline = () => {
      setIsOnline(true)
      console.log('🌐 App is online')
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      console.log('📵 App is offline')
    }
    
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
    <>
      <StatusBar isOnline={isOnline} userSubscription={userSubscription} />
      
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home onEmergencyActivate={handleEmergencyActivate} />} />
          <Route path="/emergency" element={<EmergencyMode />} />
          <Route path="/incidents" element={<Incidents userSubscription={userSubscription} />} />
          <Route path="/complaints" element={<ComplaintGenerator userSubscription={userSubscription} />} />
          <Route path="/evidence" element={<Evidence userSubscription={userSubscription} />} />
          <Route path="/fines" element={<FineCalculator userSubscription={userSubscription} />} />
          <Route path="/road-signs" element={<RoadSigns userSubscription={userSubscription} />} />
          <Route path="/legal-help" element={<LegalHelp userSubscription={userSubscription} />} />
          <Route path="/profile" element={<Profile userSubscription={userSubscription} onSubscriptionUpgrade={handleSubscriptionUpgrade} />} />
          <Route path="/menu" element={<Menu userSubscription={userSubscription} onEmergencyActivate={handleEmergencyActivate} />} />
        </Routes>
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onSuccess={() => {
            setShowSubscriptionModal(false)
            const subscription = checkSubscription()
            setUserSubscription(subscription)
          }}
        />
      )}
    </>
  )
}

function Home({ onEmergencyActivate }) {
  const navigate = useNavigate()

  const handleSectionClick = (path) => {
    console.log(`🔄 Navigating to: ${path}`)
    navigate(path)
  }

  return (
    <div className="home-container">
      {/* SOS Button */}
      <div className="sos-button-container">
        <button className="sos-button" onClick={onEmergencyActivate}>
          SOS
        </button>
      </div>

      {/* Sections Grid */}
      <div className="sections-container">
        <div className="section-card" onClick={() => handleSectionClick('/incidents')}>
          <h3>📹 Інциденти</h3>
          <p>Перегляньте всі зафіксовані випадки</p>
          <button className="btn">Переглянути</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/complaints')}>
          <h3>📝 Генератор скарг</h3>
          <p>Створіть юридично обґрунтовані скарги</p>
          <button className="btn">Створити</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/evidence')}>
          <h3>📂 Докази</h3>
          <p>Зберігайте та відправляйте докази</p>
          <button className="btn">Відкрити</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/fines')}>
          <h3>💰 Калькулятор штрафів</h3>
          <p>Дізнайтеся суми штрафів за ПДР</p>
          <button className="btn">Розрахувати</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/road-signs')}>
          <h3>🚦 Дорожні знаки</h3>
          <p>Вивчіть дорожні знаки України</p>
          <button className="btn">Вивчити</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/legal-help')}>
          <h3>⚖️ Юридична допомога</h3>
          <p>Отримайте консультацію юриста</p>
          <button className="btn">Допомога</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/profile')}>
          <h3>👤 Профіль</h3>
          <p>Керуйте вашим акаунтом</p>
          <button className="btn">Профіль</button>
        </div>

        <div className="section-card" onClick={() => handleSectionClick('/menu')}>
          <h3>📱 Меню</h3>
          <p>Всі функції додатку</p>
          <button className="btn">Меню</button>
        </div>
      </div>
    </div>
  )
}

export default App
