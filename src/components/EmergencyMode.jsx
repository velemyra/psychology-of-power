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
      console.log('🎥 STARTING CAMERA RECORDING')
      console.log('📱 USER AGENT:', navigator.userAgent)
      console.log('🖥️ PLATFORM:', navigator.platform)
      console.log('🔒 HTTPS CHECK:', window.isSecureContext)
      console.log('🌐 LOCATION:', location.protocol + '//' + location.hostname)
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia не підтримується в цьому браузері')
      }
      
      // List available devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('📹 AVAILABLE DEVICES:', devices)
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      console.log('📹 VIDEO DEVICES:', videoDevices)
      
      if (videoDevices.length === 0) {
        throw new Error('На цьому пристрої не знайдено жодної камери')
      }
      
      // Try different constraint sets for iPhone
      let stream = null
      let lastError = null
      
      // CONSTRAINT SET 1: Original working constraints
      try {
        const constraints1 = {
          video: {
            facingMode: isFrontCamera ? 'user' : 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: !isMuted
        }
        
        console.log('🎥 TRYING CONSTRAINTS 1:', constraints1)
        stream = await navigator.mediaDevices.getUserMedia(constraints1)
        console.log('✅ CONSTRAINTS 1 SUCCESS!')
      } catch (error) {
        console.log('❌ CONSTRAINTS 1 FAILED:', error.name, error.message)
        lastError = error
      }
      
      // CONSTRAINT SET 2: Lower resolution
      if (!stream) {
        try {
          const constraints2 = {
            video: {
              facingMode: isFrontCamera ? 'user' : 'environment',
              width: { ideal: 1280, max: 1280 },
              height: { ideal: 720, max: 720 }
            },
            audio: !isMuted
          }
          
          console.log('🎥 TRYING CONSTRAINTS 2:', constraints2)
          stream = await navigator.mediaDevices.getUserMedia(constraints2)
          console.log('✅ CONSTRAINTS 2 SUCCESS!')
        } catch (error) {
          console.log('❌ CONSTRAINTS 2 FAILED:', error.name, error.message)
          lastError = error
        }
      }
      
      // CONSTRAINT SET 3: Minimal
      if (!stream) {
        try {
          const constraints3 = {
            video: {
              facingMode: isFrontCamera ? 'user' : 'environment',
              width: { ideal: 640, max: 1280 },
              height: { ideal: 480, max: 720 }
            },
            audio: !isMuted
          }
          
          console.log('🎥 TRYING CONSTRAINTS 3:', constraints3)
          stream = await navigator.mediaDevices.getUserMedia(constraints3)
          console.log('✅ CONSTRAINTS 3 SUCCESS!')
        } catch (error) {
          console.log('❌ CONSTRAINTS 3 FAILED:', error.name, error.message)
          lastError = error
        }
      }
      
      // CONSTRAINT SET 4: Very basic
      if (!stream) {
        try {
          const constraints4 = {
            video: {
              facingMode: isFrontCamera ? 'user' : 'environment'
            },
            audio: !isMuted
          }
          
          console.log('🎥 TRYING CONSTRAINTS 4:', constraints4)
          stream = await navigator.mediaDevices.getUserMedia(constraints4)
          console.log('✅ CONSTRAINTS 4 SUCCESS!')
        } catch (error) {
          console.log('❌ CONSTRAINTS 4 FAILED:', error.name, error.message)
          lastError = error
        }
      }
      
      // If all failed, throw the last error
      if (!stream) {
        throw lastError || new Error('Не вдалося отримати доступ до камери жодним зі способів')
      }
      
      console.log('🎥 FINAL STREAM OBTAINED:', stream)
      console.log('🎥 STREAM TRACKS:', stream.getTracks())
      console.log('🎥 STREAM ACTIVE:', stream.active)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Add iOS specific attributes
        videoRef.current.setAttribute('playsinline', true)
        videoRef.current.setAttribute('webkit-playsinline', true)
        videoRef.current.muted = true
        
        try {
          await videoRef.current.play()
          console.log('✅ VIDEO PLAYING')
          
          // Unmute after playing starts
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false
              console.log('🔊 AUDIO UNMUTED')
            }
          }, 100)
        } catch (e) {
          console.log('❌ VIDEO PLAY ERROR:', e)
          
          // Create user interaction button for iOS
          const playButton = document.createElement('button')
          playButton.textContent = '🎥 НАТИСНІТЬ ДЛЯ ПОЧАТКУ ЗАПИСУ'
          playButton.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            padding: 25px 40px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            border: none;
            border-radius: 20px;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
          `
          
          playButton.onmouseover = () => {
            playButton.style.transform = 'translate(-50%, -50%) scale(1.1)'
          }
          
          playButton.onmouseout = () => {
            playButton.style.transform = 'translate(-50%, -50%) scale(1)'
          }
          
          playButton.onclick = async () => {
            try {
              await videoRef.current.play()
              videoRef.current.muted = false
              document.body.removeChild(playButton)
              console.log('✅ VIDEO STARTED AFTER USER INTERACTION')
            } catch (err) {
              console.log('❌ STILL FAILED TO PLAY:', err)
              document.body.removeChild(playButton)
            }
          }
          
          document.body.appendChild(playButton)
        }
      }

      streamRef.current = stream
      chunksRef.current = []

      // Simple MIME type selection
      const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
      console.log('🎥 USING MIME TYPE:', mimeType)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
          console.log('📦 CHUNK RECEIVED:', event.data.size, 'bytes')
        }
      }

      mediaRecorder.onstop = () => {
        console.log('⏹️ RECORDING STOPPED')
        const videoBlob = new Blob(chunksRef.current, { 
          type: mimeType 
        })
        console.log('📹 VIDEO BLOB CREATED:', videoBlob.size, 'bytes')
        
        // Calculate duration
        const endTime = new Date()
        const duration = Math.floor((endTime - startTime) / 1000)
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
        const durationString = `${minutes}:${seconds}`
        
        console.log('⏱️ DURATION:', durationString)
        saveIncident(videoBlob, durationString, mimeType)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setStartTime(new Date())
      setIsRecording(true)
      console.log('✅ RECORDING STARTED')

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
      console.error('❌ CAMERA ERROR:', error)
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
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    let errorMessage = 'Не вдалося отримати доступ до камери: '
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage += 'Доступ до камери заборонено.'
      
      if (isIOS) {
        errorMessage += '\n\n📱 iPhone/iOS інструкції:'
        errorMessage += '\n1. Перейдіть в Налаштування → Конфіденційність та безпека → Камера'
        errorMessage += '\n2. Увімкніть дозвіл для цього сайту'
        errorMessage += '\n3. Перезавантажте сторінку (Safari)'
        errorMessage += '\n4. Натисніть "Запис відео" знову'
      } else {
        errorMessage += '\n\n💡 Інструкції:'
        errorMessage += '\n1. Натисніть на іконку камери в адресній строкі'
        errorMessage += '\n2. Оберіть "Дозволити" для доступу до камери'
        errorMessage += '\n3. Перезавантажте сторінку (F5)'
      }
      
      errorMessage += '\n\n💡 Альтернатива: використайте завантаження файлу з камери'
      setUseFileUpload(true)
      
    } else if (error.name === 'NotFoundError') {
      errorMessage += 'Камера не знайдена на цьому пристрої.'
      
      if (isIOS) {
        errorMessage += '\n\n� Перевірте на iPhone:'
        errorMessage += '\n- Чи не заблокована камера в Налаштуваннях'
        errorMessage += '\n- Чи не використовується іншим додатком'
        errorMessage += '\n- Чи не увімкнений "Режим обмеження"'
      } else {
        errorMessage += '\n\n💡 Перевірте:'
        errorMessage += '\n- Чи є камера на пристрої'
        errorMessage += '\n- Чи не заблокована камера іншою програмою'
      }
      
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage += 'Камера вже використовується іншим додатком.'
      
      if (isIOS) {
        errorMessage += '\n\n📱 Закрийте програми на iPhone:'
        errorMessage += '\n- FaceTime, Zoom, Skype, Teams'
        errorMessage += '\n- Instagram, TikTok, Snapchat'
        errorMessage += '\n- Інші додатки з відео'
        errorMessage += '\n- Перетягніть вверх для закриття програм'
      } else {
        errorMessage += '\n\n💡 Закрийте програми:'
        errorMessage += '\n- Zoom, Skype, Teams, Discord'
        errorMessage += '\n- Інші додатки з відео'
        errorMessage += '\n- Перезавантажте сторінку'
      }
      
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      errorMessage += 'Неможливо задовольнити технічні обмеження камери.'
      
      if (isIOS) {
        errorMessage += '\n\n� Специфіка для iOS:'
        errorMessage += '\n- iOS має жорсткі обмеження на якість'
        errorMessage += '\n- Спробуйте меншу роздільну здатність'
        errorMessage += '\n- Закрийте інші вкладки Safari'
      } else {
        errorMessage += '\n\n�� Спробуйте:'
        errorMessage += '\n- Інші налаштування якості'
        errorMessage += '\n- Закрити інші програми що використовують камеру'
      }
      
    } else if (error.message.includes('HTTPS') || location.protocol !== 'https:' && location.hostname !== 'localhost') {
      errorMessage += '\n\n🔒 Для доступу до камери потрібне HTTPS з\'єднання.'
      
      if (isIOS) {
        errorMessage += '\n\n📱 iOS вимагає:'
        errorMessage += '\n- localhost або HTTPS для розробки'
        errorMessage += '\n- Налаштування VPN для локального доступу'
      } else {
        errorMessage += '\nВикористовуйте:'
        errorMessage += '\n- localhost:3002 для розробки'
        errorMessage += '\n- https://192.168.192.20:3002 для локальної мережі'
      }
      
    } else if (error.message.includes('Тайм-аут')) {
      errorMessage += 'Камера не відповідає протягом 15 секунд.'
      
      if (isIOS) {
        errorMessage += '\n\n� Рішення для iOS:'
        errorMessage += '\n- Перезавантажте сторінку Safari'
        errorMessage += '\n- Очистіть кеш Safari'
        errorMessage += '\n- Перезавантажте iPhone'
      } else {
        errorMessage += '\n\n💡 Спробуйте:'
        errorMessage += '\n- Перезавантажити сторінку'
        errorMessage += '\n- Закрити інші програми'
      }
      
    } else {
      errorMessage += '\n\nСпробуйте:'
      
      if (isIOS) {
        errorMessage += '\n📱 Для iPhone/iOS:'
        errorMessage += '\n- Перезавантажте Safari (Cmd+R)'
        errorMessage += '\n- Очистіть кеш Safari'
        errorMessage += '\n- Перевірте дозволи в Налаштуваннях'
        errorMessage += '\n- Закрийте всі програми з відео'
        errorMessage += '\n- Перезавантажте iPhone'
      } else {
        errorMessage += '\n- Перезавантажити сторінку (Ctrl+F5)'
        errorMessage += '\n- Перевірити дозволи в налаштуваннях браузера'
        errorMessage += '\n- Використати інший браузер (Chrome/Firefox/Edge)'
      }
      
      errorMessage += '\n\n💡 Альтернатива: завантаження файлу з камери'
      setUseFileUpload(true)
    }
    
    alert(errorMessage)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    console.log('File selected:', file)
    console.log('File type:', file.type)
    console.log('File size:', file.size)
    
    if (file && file.type.startsWith('video/')) {
      // Get actual video duration
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        const duration = video.duration
        console.log('Video duration:', duration)
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
        const durationString = `${minutes}:${seconds}`
        
        console.log('Duration string:', durationString)
        
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
    } else {
      alert('Будь ласка, оберіть відеофайл')
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
        
        // Try to upload to AWS S3 first
        try {
          const { S3Manager } = await import('../utils/s3-manager')
          const fileName = `incident_${incident.id}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
          
          // Only upload if AWS is available
          if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            const s3Url = await S3Manager.uploadVideo(videoBlob, fileName)
            
            if (s3Url) {
              console.log('✅ Video uploaded to AWS S3:', s3Url)
              incident.s3Url = s3Url
              incident.cloudStorage = true
            }
          } else {
            console.log('⚠️ AWS upload skipped in development')
            incident.cloudStorage = false
          }
        } catch (awsError) {
          console.log('⚠️ AWS upload failed, using local storage:', awsError)
          incident.cloudStorage = false
        }
        
        // Use the proper incidentsDB from utils
        try {
          // First try to initialize database
          const { initDB } = await import('../utils/db')
          await initDB()
          
          const { incidentsDB } = await import('../utils/db')
          await incidentsDB.add(incident)
          
          console.log('Incident saved successfully via utils')
          alert('✅ Інцидент успішно збережено!' + (incident.s3Url ? ' Завантажено в хмару!' : ' Збережено локально!'))
          
          // Also create download link as backup
          createDownloadLink(videoBlob, incident.id)
          
        } catch (dbError) {
          console.error('Error with utils DB:', dbError)
          throw dbError // Go to fallback
        }
        
      } catch (error) {
        console.error('Error saving incident via utils:', error)
        
        // Fallback to manual IndexedDB
        try {
          console.log('Trying fallback IndexedDB...')
          
          // Simple IndexedDB without external libraries
          const request = indexedDB.open('PsychologyOfPowerDB_Fallback', 1)
          
          request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains('incidents')) {
              db.createObjectStore('incidents', { keyPath: 'id' })
            }
          }
          
          request.onsuccess = async (event) => {
            const db = event.target.result
            const tx = db.transaction(['incidents'], 'readwrite')
            const store = tx.objectStore('incidents')
            await store.add(incident)
            
            console.log('Incident saved successfully (fallback)')
            alert('✅ Інцидент збережено (резервний метод)')
            
            // Create download link
            createDownloadLink(videoBlob, incident.id)
          }
          
          request.onerror = (error) => {
            console.error('Fallback DB error:', error)
            throw error
          }
          
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
