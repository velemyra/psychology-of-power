import React, { useState, useRef, useEffect } from 'react'

const EmergencyMode = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState('00:00')
  const [startTime, setStartTime] = useState(null)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [useFileUpload, setUseFileUpload] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const audioQuestions = [
    {
      text: "Ваше ім'я?",
      audio: null
    },
    {
      text: "Що сталося?",
      audio: null
    },
    {
      text: "Де ви знаходитесь?",
      audio: null
    }
  ]

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      console.log('Starting camera...')
      
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: !isMuted
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType || 'video/webm' 
        })
        console.log('Video blob created:', videoBlob.size, 'bytes')
        
        // Calculate duration
        const endTime = new Date()
        const duration = Math.floor((endTime - startTime) / 1000)
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
        const durationString = `${minutes}:${seconds}`
        
        saveIncident(videoBlob, durationString, mediaRecorder.mimeType || 'video/webm')
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setStartTime(new Date())
      setIsRecording(true)

      // Update elapsed time
      const timer = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now - startTime) / 1000)
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0')
        const seconds = Math.floor(elapsed % 60).toString().padStart(2, '0')
        setElapsedTime(`${minutes}:${seconds}`)
      }, 1000)

      // Store timer ID for cleanup
      mediaRecorder.timerId = timer

    } catch (error) {
      console.error('Error accessing camera:', error)
      handleCameraError(error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      
      // Clear timer
      if (mediaRecorderRef.current.timerId) {
        clearInterval(mediaRecorderRef.current.timerId)
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsRecording(false)
    setElapsedTime('00:00')
  }

  const handleCameraError = (error) => {
    console.error('Camera error:', error)
    
    let errorMessage = 'Не вдалося отримати доступ до камери: '
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage += 'Доступ до камери заборонено. Будь ласка, надайте дозвіл у налаштуваннях браузера.'
      errorMessage += '\n\n💡 Альтернатива: використайте завантаження файлу з камери'
      setUseFileUpload(true)
    } else if (error.name === 'NotFoundError') {
      errorMessage += 'Камера не знайдена на цьому пристрої.'
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage += 'Камера вже використовується іншим додатком. Закрийте інші програми та спробуйте знову.'
    } else if (error.message.includes('HTTPS')) {
      errorMessage += '\n\n🔒 Для доступу до камери потрібне HTTPS з\'єднання.\nВикористовуйте localhost:3002 або https://192.168.192.20:3002'
    } else {
      errorMessage += '\n\nСпробуйте:\n- Перезавантажити сторінку\n- Перевірити дозволи в налаштуваннях браузера\n- Використати інший браузер (Chrome/Firefox)\n- Альтернатива: завантаження файлу з камери'
      setUseFileUpload(true)
    }
    
    alert(errorMessage)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('video/')) {
      // Get actual video duration
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        const duration = video.duration
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
        const durationString = `${minutes}:${seconds}`
        
        console.log('Video duration:', durationString)
        
        // Set recording state with actual duration
        setStartTime(new Date())
        setIsRecording(true)
        setElapsedTime(durationString)
        
        // Save immediately with correct duration
        saveIncident(file, durationString, file.type)
        
        // Reset state after short delay
        setTimeout(() => {
          setIsRecording(false)
          setElapsedTime('00:00')
        }, 2000)
      }
      
      video.onerror = () => {
        console.error('Error loading video metadata')
        // Fallback without duration
        setStartTime(new Date())
        setIsRecording(true)
        setElapsedTime('00:00')
        
        setTimeout(() => {
          saveIncident(file, '00:00', file.type)
          setIsRecording(false)
          setElapsedTime('00:00')
        }, 1000)
      }
      
      video.src = URL.createObjectURL(file)
    }
  }

  const saveIncident = async (videoBlob, duration, videoType = 'video/webm') => {
    try {
      console.log('Saving incident with duration:', duration)
      
      const incident = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration: duration,
        video: videoBlob,
        videoType: videoType,
        type: 'emergency',
        videoSize: videoBlob.size
      }

      try {
        console.log('Attempting to save incident:', incident)
        
        // Use the proper incidentsDB from utils
        const { incidentsDB } = await import('../utils/db')
        await incidentsDB.add(incident)
        
        console.log('Incident saved successfully via utils')
        alert('✅ Інцидент успішно збережено!')
        
        // Also create download link as backup
        createDownloadLink(videoBlob, incident.id)
        
      } catch (error) {
        console.error('Error saving incident via utils:', error)
        
        // Fallback to manual IndexedDB
        try {
          console.log('Trying fallback IndexedDB...')
          const db = await openDB()
          const tx = db.transaction(['incidents'], 'readwrite')
          const store = tx.objectStore('incidents')
          await store.add(incident)
          
          console.log('Incident saved successfully (fallback)')
          alert('✅ Інцидент збережено (резервний метод)')
          
          // Create download link
          createDownloadLink(videoBlob, incident.id)
          
        } catch (fallbackError) {
          console.error('Error saving incident (fallback):', fallbackError)
          
          // Last resort: at least create download link
          createDownloadLink(videoBlob, incident.id)
          alert('⚠️ Проблема зі збереженням в базу даних, але відео доступне для завантаження')
        }
      }
    } catch (error) {
      console.error('Error in saveIncident:', error)
      alert('❌ Помилка збереження інциденту')
    }
  }

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PsychologyOfPowerDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('incidents')) {
          db.createObjectStore('incidents', { keyPath: 'id' })
        }
      }
    })
  }

  const createDownloadLink = (videoBlob, incidentId) => {
    try {
      const url = URL.createObjectURL(videoBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `incident_${incidentId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
      document.body.appendChild(a)
      
      // Auto-download
      setTimeout(() => {
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
      
      console.log('Download link created for incident:', incidentId)
    } catch (error) {
      console.error('Error creating download link:', error)
    }
  }

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera)
    setTimeout(() => {
      if (videoRef.current) {
        startRecording()
      }
    }, 100)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted
      })
    }
  }

  return (
    <div className="container">
      <div style={{
        background: 'rgba(220, 20, 60, 0.1)',
        border: '2px solid var(--primary-color)',
        borderRadius: '16px',
        padding: '30px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          color: 'var(--primary-color)',
          textShadow: '0 0 10px rgba(220, 20, 60, 0.5)'
        }}>
          🚨 ЕКСТРЕНИЙ РЕЖИМ
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '30px',
          color: '#CCC'
        }}>
          Записуйте відео при спілкуванні з поліцією
        </p>

        {/* Video Preview */}
        <div style={{
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
          aspectRatio: '16/9',
          position: 'relative',
          border: '2px solid var(--primary-color)'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(220, 20, 60, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: 'white',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
              ЗАПИС {elapsedTime}
            </div>
          )}
        </div>

        {/* File Upload Option */}
        {useFileUpload && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              📁 Завантажити відео з камери
            </h3>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            />
          </div>
        )}

        {/* Control Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="btn btn-primary"
              style={{
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              🎥 Почати запис
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="btn btn-danger"
              style={{
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              ⏹️ Зупинити запис
            </button>
          )}

          <button
            onClick={toggleCamera}
            className="btn btn-secondary"
            disabled={isRecording}
            style={{
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            🔄 Камера
          </button>

          <button
            onClick={toggleMute}
            className="btn btn-secondary"
            disabled={isRecording}
            style={{
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {isMuted ? '🔇 Звук' : '🔊 Звук'}
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left'
        }}>
          <h3 style={{ color: 'var(--gold-medium)', marginBottom: '15px' }}>
            📋 Інструкції:
          </h3>
          <ul style={{
            color: '#CCC',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Натисніть "Почати запис" перед початком спілкування з поліцією</li>
            <li>Тримайте телефон так, щоб було видно обличчя поліцейського</li>
            <li>Чітко повідомляйте дату, час та місце події</li>
            <li>Записуйте всю розмову від початку до кінця</li>
            <li>Відео автоматично збережеться та завантажиться</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default EmergencyMode
