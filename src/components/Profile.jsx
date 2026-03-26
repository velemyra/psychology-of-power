import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Crown, LogOut, Trash2, Download, Upload, Shield, Bell, Settings, ChevronRight } from 'lucide-react'
import { settingsDB, exportDB, importDB, clearDB } from '../utils/db'
import { checkSubscription, getSubscriptionStats } from '../utils/subscription'

const Profile = ({ userSubscription, onSubscriptionUpgrade }) => {
  const [userSettings, setUserSettings] = useState({})
  const [subscriptionStats, setSubscriptionStats] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    loadUserSettings()
    loadSubscriptionStats()
  }, [userSubscription])

  const loadUserSettings = async () => {
    try {
      const settings = await settingsDB.getAll()
      setUserSettings(settings)
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const loadSubscriptionStats = async () => {
    try {
      const stats = await getSubscriptionStats()
      setSubscriptionStats(stats)
    } catch (error) {
      console.error('Error loading subscription stats:', error)
    }
  }

  const updateSetting = async (key, value) => {
    try {
      await settingsDB.set(key, value)
      setUserSettings(prev => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const data = await exportDB()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `psychology-of-power-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      alert('Дані успішно експортовано!')
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Помилка при експорті даних')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      setIsImporting(true)
      
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        
        if (!confirm('Це перезапише всі ваші поточні дані. Продовжити?')) {
          return
        }
        
        await importDB(data)
        await loadUserSettings()
        await loadSubscriptionStats()
        
        alert('Дані успішно імпортовано!')
        window.location.reload()
      } catch (error) {
        console.error('Error importing data:', error)
        alert('Помилка при імпорті даних. Перевірте формат файлу.')
      } finally {
        setIsImporting(false)
      }
    }
    
    input.click()
  }

  const handleClearData = async () => {
    if (!confirm('Ви впевнені, що хочете видалити всі дані? Цю дію неможливо скасувати.')) {
      return
    }
    
    if (!confirm('Всі інциденти, скарги та налаштування будуть видалені назавжди. Продовжити?')) {
      return
    }
    
    try {
      await clearDB()
      alert('Всі дані видалено!')
      window.location.reload()
    } catch (error) {
      console.error('Error clearing data:', error)
      alert('Помилка при видаленні даних')
    }
  }

  const handleLogout = () => {
    if (confirm('Ви впевнені, що хочете вийти?')) {
      // Clear session data
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirect to home
      window.location.href = '/'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const tabs = [
    { id: 'general', label: 'Загальні', icon: User },
    { id: 'subscription', label: 'Підписка', icon: Crown },
    { id: 'notifications', label: 'Сповіщення', icon: Bell },
    { id: 'privacy', label: 'Приватність', icon: Shield },
    { id: 'data', label: 'Дані', icon: Settings }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem'
            }}>
              👤
            </div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
              Профіль користувача
            </h2>
            <p style={{ margin: '10px 0 0', opacity: 0.9 }}>
              Керуйте вашим акаунтом та налаштуваннями
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--light-color)',
            padding: '10px',
            overflowX: 'auto'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: activeTab === tab.id ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: activeTab === tab.id ? 'var(--primary-color)' : '#666',
                    transition: 'all 0.3s ease',
                    minWidth: '120px'
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'general' && (
              <div>
                <h3 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>
                  Загальні налаштування
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Email
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {userSettings.email || 'user@example.com'}
                      </p>
                    </div>
                    <Mail size={20} color="#666" />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Телефон
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {userSettings.phone || '+380 XX XXX XX XX'}
                      </p>
                    </div>
                    <Phone size={20} color="#666" />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Дата реєстрації
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {userSettings.registrationDate ? formatDate(userSettings.registrationDate) : 'Невідомо'}
                      </p>
                    </div>
                    <Calendar size={20} color="#666" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div>
                <h3 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>
                  Підписка
                </h3>
                
                {subscriptionStats && (
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '30px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      marginBottom: '15px'
                    }}>
                      <Crown size={24} style={{ color: 'var(--warning-color)' }} />
                      <h3 style={{ margin: 0, color: 'var(--dark-color)' }}>
                        {subscriptionStats.currentPlan}
                      </h3>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                          {subscriptionStats.incidentsUsed}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          Інцидентів використано
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                          {subscriptionStats.incidentsRemaining === -1 ? '∞' : subscriptionStats.incidentsRemaining}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          Залишилось
                        </div>
                      </div>
                    </div>
                    
                    {subscriptionStats.subscriptionEnds && (
                      <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
                        Підписка діє до: {formatDate(subscriptionStats.subscriptionEnds)}
                      </p>
                    )}
                    
                    {!subscriptionStats.isPro && (
                      <button
                        className="btn btn-primary"
                        onClick={onSubscriptionUpgrade}
                        style={{ marginTop: '15px' }}
                      >
                        <Crown size={16} />
                        Оновити до PRO
                      </button>
                    )}
                  </div>
                )}
                
                <div style={{
                  background: 'var(--light-color)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h4 style={{ margin: '0 0 15px', color: 'var(--dark-color)' }}>
                    Переваги вашого плану:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {subscriptionStats?.features.map((feature, index) => (
                      <li key={index} style={{ marginBottom: '8px', color: '#666' }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>
                  Сповіщення
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Push-сповіщення
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Отримувати сповіщення про оновлення
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={userSettings.pushNotifications || false}
                        onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: userSettings.pushNotifications ? 'var(--primary-color)' : '#ccc',
                        transition: '.4s',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: userSettings.pushNotifications ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Email-сповіщення
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Отримувати новини на пошту
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={userSettings.emailNotifications || false}
                        onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: userSettings.emailNotifications ? 'var(--primary-color)' : '#ccc',
                        transition: '.4s',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: userSettings.emailNotifications ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h3 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>
                  Приватність та безпека
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Автозбереження в хмару
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Автоматично резервувати дані
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={userSettings.cloudBackup || false}
                        onChange={(e) => updateSetting('cloudBackup', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: userSettings.cloudBackup ? 'var(--primary-color)' : '#ccc',
                        transition: '.4s',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: userSettings.cloudBackup ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'var(--light-color)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px', color: 'var(--dark-color)' }}>
                        Анонімна статистика
                      </h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Допомогти покращити додаток
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input
                        type="checkbox"
                        checked={userSettings.anonymousStats || false}
                        onChange={(e) => updateSetting('anonymousStats', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: userSettings.anonymousStats ? 'var(--primary-color)' : '#ccc',
                        transition: '.4s',
                        borderRadius: '24px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: userSettings.anonymousStats ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h3 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>
                  Управління даними
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{
                    background: 'var(--light-color)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h4 style={{ margin: '0 0 15px', color: 'var(--dark-color)' }}>
                      Резервне копіювання
                    </h4>
                    <p style={{ margin: '0 0 20px', color: '#666', fontSize: '14px' }}>
                      Експортуйте всі ваші дані для резервної копії
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={handleExport}
                      disabled={isExporting}
                      style={{ width: '100%' }}
                    >
                      <Download size={16} />
                      {isExporting ? 'Експорт...' : 'Експортувати дані'}
                    </button>
                  </div>

                  <div style={{
                    background: 'var(--light-color)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h4 style={{ margin: '0 0 15px', color: 'var(--dark-color)' }}>
                      Відновлення даних
                    </h4>
                    <p style={{ margin: '0 0 20px', color: '#666', fontSize: '14px' }}>
                      Імпортуйте дані з резервної копії
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={handleImport}
                      disabled={isImporting}
                      style={{ width: '100%' }}
                    >
                      <Upload size={16} />
                      {isImporting ? 'Імпорт...' : 'Імпортувати дані'}
                    </button>
                  </div>

                  <div style={{
                    background: '#fef2f2',
                    border: '2px solid #fecaca',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h4 style={{ margin: '0 0 15px', color: 'var(--danger-color)' }}>
                      Видалення даних
                    </h4>
                    <p style={{ margin: '0 0 20px', color: '#666', fontSize: '14px' }}>
                      Видаліть всі дані з пристрою (дія незворотна)
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={handleClearData}
                      style={{ width: '100%' }}
                    >
                      <Trash2 size={16} />
                      Видалити всі дані
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '20px 30px',
            background: 'var(--light-color)',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              className="btn btn-outline"
              onClick={handleLogout}
              style={{ width: '100%' }}
            >
              <LogOut size={16} />
              Вийти з акаунту
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
