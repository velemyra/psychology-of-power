import React from 'react'
import { Wifi, WifiOff, Crown, User } from 'lucide-react'

const StatusBar = ({ isOnline, userSubscription }) => {
  return (
    <div className="status-bar">
      <div className="status-indicator">
        {isOnline ? (
          <>
            <Wifi size={16} color="#00FF00" />
            <span style={{ color: '#00FF00' }}>Онлайн</span>
          </>
        ) : (
          <>
            <WifiOff size={16} color="#FF0000" />
            <span style={{ color: '#FF0000' }}>Офлайн</span>
          </>
        )}
      </div>
      
      <div className="status-indicator">
        {userSubscription?.plan === 'premium' ? (
          <>
            <Crown size={16} color="#FFD700" />
            <span style={{ color: '#FFD700' }}>Преміум</span>
          </>
        ) : (
          <>
            <User size={16} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF' }}>Безкоштовний</span>
          </>
        )}
      </div>
    </div>
  )
}

export default StatusBar
