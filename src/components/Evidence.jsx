import React, { useState, useEffect } from 'react'
import { FolderOpen, Download, Share2, Video, Image, FileText, Calendar } from 'lucide-react'

const Evidence = ({ userSubscription }) => {
  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Симуляція завантаження доказів
    setTimeout(() => {
      setEvidence([
        {
          id: 1,
          type: 'video',
          incidentId: 1,
          size: 5000000,
          cameraType: 'front',
          url: '#'
        },
        {
          id: 2,
          type: 'image',
          incidentId: 1,
          size: 2000000,
          url: '#'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const downloadEvidence = (evidenceItem) => {
    alert(`Завантаження доказу #${evidenceItem.id}`)
  }

  const shareEvidence = async (evidenceItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Докази інциденту',
          text: `Докази інциденту #${evidenceItem.incidentId}`
        })
      } else {
        alert('Посилання скопійовано в буфер обміну')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={20} />
      case 'image': return <Image size={20} />
      default: return <FileText size={20} />
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Невідомо'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Завантаження доказів...</div>
      </div>
    )
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
            <FolderOpen size={40} />
            Докази
          </h2>

          {evidence.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <FolderOpen size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
              <h3>Доказів не знайдено</h3>
              <p>Створіть новий інцидент для додавання доказів</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {evidence.map(item => (
                <div key={item.id} style={{
                  background: 'var(--light-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {getFileIcon(item.type)}
                      <div>
                        <h4 style={{
                          margin: 0,
                          color: 'var(--dark-color)',
                          fontSize: '1.1rem'
                        }}>
                          {item.type === 'video' ? 'Відеозапис' : 
                           item.type === 'image' ? 'Зображення' : 'Документ'}
                        </h4>
                        <p style={{
                          margin: '5px 0 0',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          Інцидент #{item.incidentId}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => downloadEvidence(item)}
                        className="btn btn-primary"
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                      >
                        <Download size={16} />
                      </button>
                      
                      <button
                        onClick={() => shareEvidence(item)}
                        className="btn btn-secondary"
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Calendar size={14} />
                      {new Date().toLocaleDateString()}
                    </div>
                    
                    <div>
                      Розмір: {formatFileSize(item.size)}
                    </div>
                    
                    {item.cameraType && (
                      <div>
                        Камера: {item.cameraType === 'front' ? 'Фронтальна' : 'Основна'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Evidence
