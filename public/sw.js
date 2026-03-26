// Service Worker for Psychology of Power PWA
const CACHE_NAME = 'psychology-of-power-v1'
const RUNTIME_CACHE = 'psychology-of-power-runtime'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/src/components/Header.jsx',
  '/src/components/EmergencyMode.jsx',
  '/src/components/Incidents.jsx',
  '/src/components/Profile.jsx',
  '/src/components/SubscriptionModal.jsx',
  '/src/utils/db.js',
  '/src/utils/subscription.js',
  '/manifest.json',
  // Add other component files as they are created
]

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('Service Worker: Activation failed', error)
      })
  )
})

// Fetch requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          // For static files, return from cache
          if (STATIC_FILES.some(file => request.url.includes(file))) {
            return response
          }
          
          // For other files, try network first, then cache
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone()
                caches.open(RUNTIME_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
                  .catch((error) => {
                    console.error('Service Worker: Failed to cache response', error)
                  })
              }
              return networkResponse
            })
            .catch(() => {
              // Network failed, return cached version
              return response
            })
        }
        
        // Not in cache, try network
        return fetch(request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone()
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
                .catch((error) => {
                  console.error('Service Worker: Failed to cache response', error)
                })
            }
            return networkResponse
          })
          .catch((error) => {
            console.error('Service Worker: Network request failed', error)
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html')
            }
            
            // Return error for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            })
          })
      })
      .catch((error) => {
        console.error('Service Worker: Fetch error', error)
        return new Response('Service Worker Error', {
          status: 500,
          statusText: 'Internal Server Error'
        })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'sync-incidents') {
    event.waitUntil(syncIncidents())
  } else if (event.tag === 'sync-complaints') {
    event.waitUntil(syncComplaints())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')
  
  const options = {
    body: event.data ? event.data.text() : 'Нове сповіщення від ПСИХОЛОГІЯ СИЛИ',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Відкрити додаток',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Закрити',
        icon: '/icons/xmark.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('ПСИХОЛОГІЯ СИЛИ', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Periodic background sync (for updates)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync', event.tag)
  
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates())
  }
})

// Sync incidents to server
async function syncIncidents() {
  try {
    // Get all unsynced incidents from IndexedDB
    const incidents = await getUnsyncedIncidents()
    
    for (const incident of incidents) {
      try {
        // Send to server
        const response = await fetch('/api/incidents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(incident)
        })
        
        if (response.ok) {
          // Mark as synced
          await markIncidentAsSynced(incident.id)
        }
      } catch (error) {
        console.error('Failed to sync incident', error)
      }
    }
  } catch (error) {
    console.error('Sync incidents failed', error)
  }
}

// Sync complaints to server
async function syncComplaints() {
  try {
    const complaints = await getUnsyncedComplaints()
    
    for (const complaint of complaints) {
      try {
        const response = await fetch('/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(complaint)
        })
        
        if (response.ok) {
          await markComplaintAsSynced(complaint.id)
        }
      } catch (error) {
        console.error('Failed to sync complaint', error)
      }
    }
  } catch (error) {
    console.error('Sync complaints failed', error)
  }
}

// Check for updates
async function checkForUpdates() {
  try {
    const response = await fetch('/api/updates')
    const updates = await response.json()
    
    if (updates.length > 0) {
      // Show notification about updates
      self.registration.showNotification('Оновлення додатку', {
        body: `Доступно ${updates.length} оновлень`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        data: {
          url: '/updates'
        }
      })
    }
  } catch (error) {
    console.error('Check for updates failed', error)
  }
}

// Helper functions (these would need to be implemented in your app)
async function getUnsyncedIncidents() {
  // This would interact with IndexedDB
  return []
}

async function markIncidentAsSynced(id) {
  // This would update IndexedDB
}

async function getUnsyncedComplaints() {
  // This would interact with IndexedDB
  return []
}

async function markComplaintAsSynced(id) {
  // This would update IndexedDB
}

// Message handling (for communication with app)
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    })
  }
})

// Cleanup old caches
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      })
    )
  }
})

console.log('Service Worker: Loaded successfully')
