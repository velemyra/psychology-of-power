import React, { useState, useEffect } from 'react'
import { Menu, X, Phone, Shield, FileText, Settings, User, AlertTriangle, Wifi, WifiOff, Crown, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, LogOut, Home, ChevronLeft, ChevronRight } from 'lucide-react'

const Header = ({ onEmergencyActivate, onSubscriptionUpgrade, userSubscription, isOnline }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const navigation = [
    { name: '🏠 Головна', href: '/', icon: Home },
    { name: '📹 Інциденти', href: '/incidents', icon: Shield },
    { name: '📝 Скарги', href: '/complaints', icon: FileText },
    { name: '📸 Докази', href: '/evidence', icon: Shield },
    { name: '💰 Штрафи', href: '/fines', icon: FileText },
    { name: '🚦 Знаки', href: '/road-signs', icon: Shield },
    { name: '⚖️ Допомога', href: '/legal-help', icon: Shield },
    { name: '📱 Меню', href: '/menu', icon: Menu },
  ]

  const currentIndex = navigation.findIndex(item => item.href === currentPath)
  const previousItem = currentIndex > 0 ? navigation[currentIndex - 1] : null
  const nextItem = currentIndex < navigation.length - 1 ? navigation[currentIndex + 1] : null

  const handleNavigation = (href) => {
    setCurrentPath(href)
    setIsMenuOpen(false)
    window.location.href = href
  }

  const handleBack = () => {
    window.history.back()
    setIsMenuOpen(false)
  }

  const handleForward = () => {
    window.history.forward()
    setIsMenuOpen(false)
  }

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleScrollDown = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleExit = () => {
    if (confirm('Ви впевнені, що хочете вийти з додатку?')) {
      window.close()
      window.location.href = 'about:blank'
    }
  }

  // Navigation arrows for sections
  const NavigationArrows = () => {
    const currentIndex = navigation.findIndex(item => item.href === currentPath)
    const previousItem = currentIndex > 0 ? navigation[currentIndex - 1] : null
    const nextItem = currentIndex < navigation.length - 1 ? navigation[currentIndex + 1] : null

    if (currentPath === '/menu') return null

    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 10px',
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        {previousItem && (
          <button
            onClick={() => handleNavigation(previousItem.href)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(220, 20, 60, 0.9)',
              border: '2px solid var(--gold-medium)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'all',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            title={previousItem.name}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {nextItem && (
          <button
            onClick={() => handleNavigation(nextItem.href)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(220, 20, 60, 0.9)',
              border: '2px solid var(--gold-medium)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'all',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            title={nextItem.name}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <NavigationArrows />
      
      <header className="header" style={{
        background: 'rgba(28, 28, 28, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Left side - Status Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {/* Online Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '20px',
                background: isOnline ? 'var(--success-color)' : 'var(--danger-color)',
                color: isOnline ? 'var(--text-on-gold)' : 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                border: isOnline ? '2px solid var(--success-dark)' : '2px solid #8B0000',
                boxShadow: isOnline ? 'var(--shadow-green)' : 'var(--shadow)'
              }}>
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* Subscription Status */}
              {userSubscription && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  background: userSubscription?.type === 'free' ? 'var(--gold-medium)' : 'var(--success-color)',
                  color: userSubscription?.type === 'free' ? 'var(--text-on-gold)' : 'var(--text-on-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  border: userSubscription?.type === 'free' ? '2px solid var(--gold-dark)' : '2px solid var(--success-dark)',
                  boxShadow: userSubscription?.type === 'free' ? 'var(--shadow-gold)' : 'var(--shadow-green)'
                }}>
                  <Crown size={14} />
                  {userSubscription?.type === 'free' ? 'Free' : (userSubscription?.type || 'PRO').toUpperCase()}
                </div>
              )}

              {/* Profile Button */}
              <button
                onClick={() => window.location.href = '/profile'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--secondary-color)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <User size={20} />
              </button>
            </div>

            {/* Right side - Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
              className="mobile-menu-toggle"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Menu Header */}
          <div style={{
            background: 'var(--dark-color)',
            padding: '20px',
            borderBottom: '2px solid var(--gold-medium)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>📱 Меню</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--light-color)'
          }}>
            {/* Navigation Items */}
            <div style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = item.href === currentPath
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: isActive ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? 'white' : 'white',
                      border: isActive ? '2px solid var(--gold-medium)' : '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '16px',
                      fontWeight: '500',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                    {isActive && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '14px' }}>⚡ Швидкі дії</h3>
              <div style={{
                display: 'grid',
                gap: '8px'
              }}>
                {previousItem && (
                  <button
                    onClick={() => handleNavigation(previousItem.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <ArrowLeft size={14} />
                    <span>{previousItem.name}</span>
                  </button>
                )}
                {nextItem && (
                  <button
                    onClick={() => handleNavigation(nextItem.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <span>{nextItem.name}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* SOS Button */}
            <div style={{
              background: 'rgba(220, 20, 60, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid var(--primary-color)'
            }}>
              <button
                onClick={() => {
                  onEmergencyActivate()
                  setIsMenuOpen(false)
                }}
                style={{
                  width: '100%',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, var(--primary-color), #B91C1C)',
                  color: 'white',
                  border: '2px solid var(--gold-medium)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span style={{ textAlign: 'center', lineHeight: '1.2' }}>
                  🚨 ЕКСТРЕНИЙ РЕЖИМ
                </span>
                <AlertTriangle 
                  size={24} 
                  style={{
                    animation: 'pulse 1.5s infinite',
                    color: '#ffffff'
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (min-width: 768px) {
          .mobile-menu-toggle {
            display: none !important;
          }
          
          .desktop-nav {
            display: flex !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default Header
