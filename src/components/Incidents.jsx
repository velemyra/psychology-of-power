import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Play, Download, Trash2, Search, Filter, FileText, Share2 } from 'lucide-react'
import { incidentsDB } from '../utils/db'
import { checkIncidentLimit, checkFeatureAccess } from '../utils/subscription'

const Incidents = ({ userSubscription }) => {
  const [incidents, setIncidents] = useState([])
  const [filteredIncidents, setFilteredIncidents] = useState([])
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [incidentLimit, setIncidentLimit] = useState({ allowed: true, remaining: -1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIncidents()
    checkIncidentLimits()
  }, [])

  useEffect(() => {
    filterIncidents()
  }, [incidents, searchTerm, filterType])

  const loadIncidents = async () => {
    try {
      setLoading(true)
      const allIncidents = await incidentsDB.getAll()
      setIncidents(allIncidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (error) {
      console.error('Error loading incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkIncidentLimits = async () => {
    try {
      const limit = await checkIncidentLimit()
      setIncidentLimit(limit)
    } catch (error) {
      console.error('Error checking incident limit:', error)
    }
  }

  const filterIncidents = () => {
    let filtered = [...incidents]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(incident => 
        incident.id.toString().includes(searchTerm) ||
        incident.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(incident => incident.type === filterType)
    }

    setFilteredIncidents(filtered)
  }

  const deleteIncident = async (incidentId) => {
    if (!confirm('Ви впевнені, що хочете видалити цей інцидент?')) {
      return
    }

    try {
      await incidentsDB.delete(incidentId)
      await loadIncidents()
      await checkIncidentLimits()
      
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(null)
      }
    } catch (error) {
      console.error('Error deleting incident:', error)
      alert('Помилка при видаленні інциденту')
    }
  }

  const downloadIncident = async (incident) => {
    try {
      // Create a zip-like file with video and metadata
      const metadata = {
        id: incident.id,
        timestamp: incident.timestamp,
        location: incident.location,
        type: incident.type,
        duration: incident.duration,
        notes: incident.notes,
        videoSize: incident.videoSize,
        videoType: incident.videoType
      }

      // Convert metadata to JSON
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' })
      
      // Create download links
      const videoUrl = URL.createObjectURL(incident.video)
      const metadataUrl = URL.createObjectURL(metadataBlob)

      // Determine file extension based on video type
      const fileExtension = incident.videoType?.includes('mp4') ? 'mp4' : 'webm'

      // Download video
      const videoLink = document.createElement('a')
      videoLink.href = videoUrl
      videoLink.download = `incident_${incident.id}_video.${fileExtension}`
      videoLink.click()

      // Download metadata
      setTimeout(() => {
        const metadataLink = document.createElement('a')
        metadataLink.href = metadataUrl
        metadataLink.download = `incident_${incident.id}_metadata.json`
        metadataLink.click()
      }, 100)

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(videoUrl)
        URL.revokeObjectURL(metadataUrl)
      }, 1000)

    } catch (error) {
      console.error('Error downloading incident:', error)
      alert('Помилка при завантаженні інциденту')
    }
  }

  const shareIncident = async (incident) => {
    try {
      if (navigator.share) {
        // Determine file extension
        const fileExtension = incident.videoType?.includes('mp4') ? 'mp4' : 'webm'
        const mimeType = incident.videoType || 'video/webm'
        
        const shareData = {
          title: `Інцидент #${incident.id}`,
          text: `Інцидент зафіксований ${new Date(incident.timestamp).toLocaleString('uk-UA')}`,
          files: [new File([incident.video], `incident_${incident.id}.${fileExtension}`, { type: mimeType })]
        }
        
        await navigator.share(shareData)
      } else {
        // Fallback - copy to clipboard
        const text = `Інцидент #${incident.id}\nДата: ${new Date(incident.timestamp).toLocaleString('uk-UA')}\nТип: ${incident.type}\nТривалість: ${incident.duration}\n${incident.location ? `Локація: ${incident.location.latitude}, ${incident.location.longitude}` : ''}`
        
        await navigator.clipboard.writeText(text)
        alert('Інформація про інцидент скопійована в буфер обміну')
      }
    } catch (error) {
      console.error('Error sharing incident:', error)
      alert('Помилка при поширенні інциденту')
    }
  }

  const openVideoModal = (incident) => {
    setSelectedIncident(incident)
    setShowVideoModal(true)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    return duration
  }

  const canAccessFeature = async (feature) => {
    try {
      return await checkFeatureAccess(feature)
    } catch (error) {
      return false
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: 'var(--dark-color)',
            marginBottom: '20px',
            fontSize: '2rem'
          }}>
            📹 Інциденти
          </h2>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'var(--light-color)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {incidents.length}
              </div>
              <div style={{ color: '#666' }}>Всього інцидентів</div>
            </div>
            
            <div style={{
              background: 'var(--light-color)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                {incidentLimit.remaining === -1 ? '∞' : incidentLimit.remaining}
              </div>
              <div style={{ color: '#666' }}>Залишилось цього місяця</div>
            </div>
            
            <div style={{
              background: 'var(--light-color)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                {incidents.filter(i => i.type === 'emergency').length}
              </div>
              <div style={{ color: '#666' }}>Екстрені випадки</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
              <input
                type="text"
                placeholder="Пошук інцидентів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px 12px 45px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '12px 15px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Всі типи</option>
              <option value="emergency">Екстрені</option>
              <option value="routine">Звичайні</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/emergency'}
            >
              🚨 Новий інцидент
            </button>
          </div>

          {/* Warning if limit reached */}
          {!incidentLimit.allowed && (
            <div style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <strong>Досягнуто ліміт інцидентів</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Оновіть до PRO плану для необмеженої кількості інцидентів
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Incidents List */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          {filteredIncidents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📹</div>
              <h3 style={{ marginBottom: '10px' }}>
                {incidents.length === 0 ? 'Немає інцидентів' : 'Нічого не знайдено'}
              </h3>
              <p>
                {incidents.length === 0 
                  ? 'Почніть фіксувати інциденти для їх збереження'
                  : 'Спробуйте змінити параметри пошуку'
                }
              </p>
              {incidents.length === 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/emergency'}
                  style={{ marginTop: '20px' }}
                >
                  🚨 Створити перший інцидент
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="incident-item">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{
                        color: 'var(--primary-color)',
                        marginBottom: '5px'
                      }}>
                        Інцидент #{incident.id}
                      </h3>
                      <div className="incident-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} />
                          {formatDate(incident.timestamp)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} />
                          {formatDuration(incident.duration)}
                        </span>
                        {incident.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={14} />
                            {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => openVideoModal(incident)}
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        <Play size={14} />
                        Відео
                      </button>
                      
                      <button
                        className="btn btn-secondary"
                        onClick={() => downloadIncident(incident)}
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        <Download size={14} />
                        Завантажити
                      </button>
                      
                      <button
                        className="btn btn-success"
                        onClick={() => shareIncident(incident)}
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        <Share2 size={14} />
                        Поділитися
                      </button>
                      
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteIncident(incident.id)}
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        <Trash2 size={14} />
                        Видалити
                      </button>
                    </div>
                  </div>
                  
                  {incident.notes && (
                    <div style={{
                      background: 'var(--light-color)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginTop: '15px'
                    }}>
                      <strong>Нотатки:</strong> {incident.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedIncident && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>Відео інциденту #{selectedIncident.id}</h3>
              <button
                className="modal-close"
                onClick={() => setShowVideoModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '16/9',
              marginBottom: '20px'
            }}>
              <video
                controls
                playsInline
                muted={false}
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  console.error('Video playback error:', e)
                  alert('Помилка відтворення відео. Спробуйте завантажити файл.')
                }}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
              >
                <source src={URL.createObjectURL(selectedIncident.video)} type={selectedIncident.videoType || 'video/webm'} />
                <source src={URL.createObjectURL(selectedIncident.video)} type="video/mp4" />
                <source src={URL.createObjectURL(selectedIncident.video)} type="video/quicktime" />
                Ваш браузер не підтримує відео.
              </video>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <strong>Дата:</strong><br />
                {formatDate(selectedIncident.timestamp)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <strong>Тривалість:</strong><br />
                {formatDuration(selectedIncident.duration)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <strong>Тип:</strong><br />
                {selectedIncident.type || 'Невідомо'}
              </div>
              {selectedIncident.location && (
                <div style={{ textAlign: 'center' }}>
                  <strong>Локація:</strong><br />
                  <a
                    href={`https://maps.google.com/?q=${selectedIncident.location.latitude},${selectedIncident.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    Переглянути на карті
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Incidents
