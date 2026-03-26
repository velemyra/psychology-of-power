import React, { useState } from 'react'
import { Phone, Mail, MessageCircle, Book, AlertCircle, Users, Clock, ChevronDown } from 'lucide-react'

const LegalHelp = ({ userSubscription }) => {
  const [expandedSection, setExpandedSection] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    message: ''
  })

  const legalCategories = [
    {
      id: 'traffic',
      title: 'Порушення ПДР',
      icon: '🚗',
      articles: [
        'Стаття 122 - Перевищення швидкості',
        'Стаття 126 - Відсутність документів',
        'Стаття 130 - Керування в стані сп\'яніння'
      ]
    },
    {
      id: 'police',
      title: 'Спілкування з поліцією',
      icon: '👮',
      articles: [
        'Права під час зупинки',
        'Обшук транспортного засобу',
        'Протокол та його підписання'
      ]
    },
    {
      id: 'fines',
      title: 'Штрафи та оскарження',
      icon: '💰',
      articles: [
        'Процедура оскарження штрафу',
        'Судова практика',
        'Терміни подання скарги'
      ]
    }
  ]

  const consultants = [
    {
      id: 1,
      name: 'Іван Петренко',
      specialization: 'Адміністративне право',
      experience: '10 років',
      rating: 4.8,
      available: true
    },
    {
      id: 2,
      name: 'Олена Коваль',
      specialization: 'Дорожнє право',
      experience: '7 років',
      rating: 4.9,
      available: false
    }
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    alert('Запит відправлено! Юрист зв\'яжеться з вами найближчим часом.')
    setContactForm({ name: '', phone: '', message: '' })
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
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
            fontSize: '2rem'
          }}>
            ⚖️ Юридична допомога
          </h2>

          {/* Категорії допомоги */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Оберіть категорію
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {legalCategories.map(category => (
                <div key={category.id} style={{
                  background: 'var(--light-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ fontSize: '24px' }}>{category.icon}</span>
                      <h4 style={{
                        margin: 0,
                        color: 'var(--dark-color)',
                        fontSize: '1.1rem'
                      }}>
                        {category.title}
                      </h4>
                    </div>
                    <ChevronDown 
                      size={20} 
                      style={{
                        transform: expandedSection === category.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                  
                  {expandedSection === category.id && (
                    <div style={{
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #ddd'
                    }}>
                      {category.articles.map((article, index) => (
                        <div key={index} style={{
                          padding: '8px 0',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          • {article}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div
                    onClick={() => toggleSection(category.id)}
                    style={{ marginTop: '10px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Консультанти */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '20px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Users size={24} />
              Наші юристи
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {consultants.map(consultant => (
                <div key={consultant.id} style={{
                  background: 'var(--light-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--secondary-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}>
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <h4 style={{
                    margin: '0 0 5px 0',
                    color: 'var(--dark-color)',
                    fontSize: '1.1rem'
                  }}>
                    {consultant.name}
                  </h4>
                  
                  <p style={{
                    margin: '0 0 5px 0',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    {consultant.specialization}
                  </p>
                  
                  <p style={{
                    margin: '0 0 10px 0',
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    Досвід: {consultant.experience}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: '#FFA500' }}>⭐</span>
                    <span style={{ fontSize: '0.9rem' }}>{consultant.rating}</span>
                  </div>
                  
                  <div style={{
                    fontSize: '0.9rem',
                    color: consultant.available ? 'var(--success-color)' : 'var(--danger-color)',
                    fontWeight: 'bold'
                  }}>
                    {consultant.available ? '✓ Доступний' : '✗ Зайнятий'}
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      width: '100%',
                      opacity: consultant.available ? 1 : 0.5,
                      cursor: consultant.available ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!consultant.available}
                  >
                    {consultant.available ? 'Записатися' : 'Недоступний'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Контактна форма */}
          <div style={{
            background: 'var(--light-color)',
            borderRadius: '12px',
            padding: '30px'
          }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Швидка консультація
            </h3>
            
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px solid var(--light-color)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="tel"
                  placeholder="Ваш телефон"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px solid var(--light-color)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  placeholder="Опишіть вашу ситуацію"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px solid var(--light-color)',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px'
                }}
              >
                <MessageCircle size={20} style={{ marginRight: '10px' }}
                />
                Відправити запит
              </button>
            </form>
          </div>

          {/* Контактна інформація */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#666'
            }}>
              <Phone size={20} />
              <span>0-800-123-456</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#666'
            }}>
              <Mail size={20} />
              <span>help@psychology-of-power.com</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#666'
            }}>
              <Clock size={20} />
              <span>Пн-Пт: 9:00-18:00</span>
            </div>
          </div>

          {/* Попередження про підписку */}
          {userSubscription?.planId === 'free' && (
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
                Безкоштовна версія: обмежена юридична допомога. Для повних консультацій оновіть до PRO/Premium.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LegalHelp
