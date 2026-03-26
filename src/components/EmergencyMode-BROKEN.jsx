import React, { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Mic, MicOff, Square, Navigation, Clock, MapPin } from 'lucide-react'

const EmergencyMode = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [location, setLocation] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState('00:00')
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const locationIntervalRef = useRef(null)
  const fileInputRef = useRef(null)

  const audioQuestions = [
    { id: 1, text: "Назвіть причину зупинки згідно ст.35 КУпАП", audio: "/audio/question1.mp3" },
    { id: 2, text: "Пред'явіть ваше службове посвідчення", audio: "/audio/question2.mp3" },
    { id: 3, text: "Чи є свідки порушення?", audio: "/audio/question3.mp3" },
    { id: 4, text: "Поясніть мої права згідно Закону про Національну поліцію", audio: "/audio/question4.mp3" },
    { id: 5, text: "Чи проводиться відеозапис спілкування?", audio: "/audio/question5.mp3" },
    { id: 6, text: "Яка стаття ПДР порушена?", audio: "/audio/question6.mp3" },
    { id: 7, text: "Чи маю я право на юридичну допомогу?", audio: "/audio/question7.mp3" },
    { id: 8, text: "Де можна ознайомитись з матеріалами справи?", audio: "/audio/question8.mp3" }
  ]

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)
    
    // On iOS, default to file upload mode
    if (ios) {
      setUseFileUpload(true)
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        const now = new Date()
        const diff = Math.floor((now - startTime) / 1000)
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0')
        const seconds = (diff % 60).toString().padStart(2, '0')
        setElapsedTime(`${minutes}:${seconds}`)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isRecording, startTime])

  useEffect(() => {
    if (isRecording) {
      locationIntervalRef.current = setInterval(() => {
        getCurrentLocation()
      }, 5000)
    } else {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current)
      }
    }

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current)
      }
    }
  }, [isRecording])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const startRecording = async () => {
    // For iOS, use file upload instead of camera
    if (isIOS) {
      fileInputRef.current?.click()
      return
    }

    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported')
      }

      // Check if we're in secure context (HTTPS required for camera)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Camera access requires HTTPS connection')
      }

      // Request camera permissions first
      console.log('Requesting camera permissions...')
      
      // Enhanced constraints for mobile compatibility
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: !isMuted
      }

      // Try to get media stream with fallback
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (mobileError) {
        console.warn('Mobile constraints failed, trying basic:', mobileError)
        // Fallback to basic constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: !isMuted
          })
        } catch (basicError) {
          console.warn('Basic constraints failed, trying video only:', basicError)
          // Last fallback - video only
          stream = await navigator.mediaDevices.getUserMedia({
            video: true
          })
        }
      }

      streamRef.current = stream
      videoRef.current.srcObject = stream

      // Check MediaRecorder support
      if (!MediaRecorder.isTypeSupported('video/webm')) {
        throw new Error('WebM format not supported')
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          if (blob.size > 0) {
            saveIncident(blob)
          } else {
            console.error('Empty blob created')
            alert('Помилка: відео не записалось')
          }
        } catch (blobError) {
          console.error('Error creating blob:', blobError)
          alert('Помилка створення відеофайлу')
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error)
        alert('Помилка запису відео')
      }

      // Start recording with timeslice for better mobile performance
      mediaRecorder.start(1000)
      setIsRecording(true)
      setStartTime(new Date())
      getCurrentLocation()

    } catch (error) {
      console.error('Error starting recording:', error)
      let errorMessage = 'Не вдалося отримати доступ до камери. '
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += '\n\n📱 Для доступу до камери:\n'
        errorMessage += '1. Натисніть на іконку замка 🔒 в адресній строкі\n'
        errorMessage += '2. Дозвольте доступ до камери та мікрофону\n'
        errorMessage += '3. Перезавантажте сторінку\n\n'
        errorMessage += 'Або перевірте налаштування Safari: Налаштування → Safari → Камера'
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      setIsRecording(false)
      setElapsedTime('00:00')
    }
  }

  const toggleCamera = () => {
    if (isRecording) {
      stopRecording()
    }
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

  const playAudio = (audioPath) => {
    const audio = new Audio(audioPath)
    audio.play().catch(error => {
      console.error('Error playing audio:', error)
      // Fallback to text-to-speech
      const question = audioQuestions.find(q => q.audio === audioPath)
      if (question) {
        const utterance = new SpeechSynthesisUtterance(question.text)
        utterance.lang = 'uk-UA'
        speechSynthesis.speak(utterance)
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
      
      console.log('Download link created for video')
    } catch (error) {
      console.error('Error creating download link:', error)
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
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--danger-color)',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              🚨 ЕКСТРЕНИЙ РЕЖИМ
            </h2>
            <p style={{ margin: '10px 0 0', opacity: 0.9 }}>
              Фіксація спілкування з поліцією
            </p>
          </div>

          {/* Video Section */}
          <div style={{ padding: '20px' }}>
            <div className="video-container" style={{
              position: 'relative',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '16/9',
              marginBottom: '20px'
            }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
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
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    background: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite'
                  }} />
                  ЗАПИС {elapsedTime}
                </div>
              )}

              {/* Location Info */}
              {location && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} />
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {/* File input for iOS/fallback */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`btn ${isRecording ? 'btn-danger' : 'btn-danger'}`}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  height: '60px'
                }}
              >
                {isRecording ? (
                  <>
                    <Square size={20} />
                    ЗУПИНИТИ
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    {isIOS ? 'ВИБРАТИ ВІДЕО' : 'ПОЧАТИ ЗАПИС'}
                  </>
                )}
              </button>

              {!useFileUpload && (
                <>
                  <button
                    onClick={toggleCamera}
                    className="btn btn-secondary"
                    disabled={isRecording}
                    style={{ height: '60px' }}
                  >
                    <CameraOff size={20} />
                    ПЕРЕМКНУТИ КАМЕРУ
                  </button>

                  <button
                    onClick={toggleMute}
                    className="btn btn-secondary"
                    style={{ height: '60px' }}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    {isMuted ? 'УВІМКНУТИ МІК' : 'ВИМКНУТИ МІК'}
                  </button>
                </>
              )}

              {isIOS && (
                <button
                  onClick={() => setUseFileUpload(!useFileUpload)}
                  className="btn btn-secondary"
                  style={{ height: '60px' }}
                >
                  <Camera size={20} />
                  {useFileUpload ? 'СПРОБУВАТИ КАМЕРУ' : 'ЗАВАНТАЖИТИ ФАЙЛ'}
                </button>
              )}
            </div>

            {/* iOS/Fallback Info */}
            {(isIOS || useFileUpload) && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                  📱 {isIOS ? 'iPhone/iPad' : 'Режим завантаження'}
                </h4>
                <p style={{ margin: '0', color: '#6c757d' }}>
                  {isIOS 
                    ? 'На iOS пристроях камера через браузер обмежена. Використовуйте завантаження відео з камери телефону.'
                    : 'Натисніть кнопку вище, щоб вибрати відеофайл з вашого пристрою.'}
                </p>
              </div>
            )}

            {/* Audio Questions */}
            <div>
              <h3 style={{
                marginBottom: '20px',
                color: 'var(--dark-color)',
                textAlign: 'center'
              }}>
                🎵 Юридичні питання
              </h3>
              
              <div className="audio-buttons">
                {audioQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => playAudio(question.audio)}
                    className="audio-button"
                    style={{
                      padding: '15px',
                      background: 'var(--secondary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'var(--accent-color)'
                      e.target.style.transform = 'translateX(5px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'var(--secondary-color)'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                    🔊 {question.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyMode
