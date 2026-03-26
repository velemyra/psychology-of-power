// Simple localStorage-based database for Psychology of Power V2
// No IndexedDB complications - just reliable localStorage

const DB_NAME = 'PsychologyOfPowerV2'
const STORES = {
  incidents: 'incidents',
  complaints: 'complaints',
  evidence: 'evidence',
  fines: 'fines',
  roadSigns: 'roadSigns',
  userSettings: 'userSettings',
  subscriptions: 'subscriptions'
}

// Initialize database
export const initDB = async () => {
  try {
    // Create initial storage structure if not exists
    if (!localStorage.getItem(DB_NAME)) {
      const initialData = {
        incidents: [],
        complaints: [],
        evidence: [],
        fines: [],
        roadSigns: [],
        userSettings: {
          theme: 'dark',
          language: 'uk',
          notifications: true
        },
        subscriptions: {
          plan: 'free',
          status: 'active',
          expiresAt: null
        }
      }
      localStorage.setItem(DB_NAME, JSON.stringify(initialData))
      console.log('✅ Database initialized successfully')
    }
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}

// Get database instance
export const getDB = () => {
  try {
    const data = localStorage.getItem(DB_NAME)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('❌ Error getting database:', error)
    return {}
  }
}

// Save database instance
export const saveDB = (data) => {
  try {
    localStorage.setItem(DB_NAME, JSON.stringify(data))
    console.log('✅ Database saved successfully')
    return true
  } catch (error) {
    console.error('❌ Error saving database:', error)
    return false
  }
}

// Incidents operations
export const incidentsDB = {
  // Add new incident
  async add(incident) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      
      // Add timestamp if not exists
      if (!incident.timestamp) {
        incident.timestamp = new Date().toISOString()
      }
      
      incidents.push(incident)
      db.incidents = incidents
      
      const saved = saveDB(db)
      console.log('✅ Incident saved:', incident.id)
      return saved ? incident : null
    } catch (error) {
      console.error('❌ Error adding incident:', error)
      return null
    }
  },

  // Get all incidents
  async getAll() {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      console.log('✅ Loaded incidents:', incidents.length)
      return incidents
    } catch (error) {
      console.error('❌ Error getting incidents:', error)
      return []
    }
  },

  // Get incident by ID
  async getById(id) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      return incidents.find(incident => incident.id === id) || null
    } catch (error) {
      console.error('❌ Error getting incident by ID:', error)
      return null
    }
  },

  // Update incident
  async update(incident) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      const index = incidents.findIndex(i => i.id === incident.id)
      
      if (index !== -1) {
        incidents[index] = incident
        db.incidents = incidents
        const saved = saveDB(db)
        console.log('✅ Incident updated:', incident.id)
        return saved ? incident : null
      }
      return null
    } catch (error) {
      console.error('❌ Error updating incident:', error)
      return null
    }
  },

  // Delete incident
  async delete(id) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      const filtered = incidents.filter(incident => incident.id !== id)
      db.incidents = filtered
      
      const saved = saveDB(db)
      console.log('✅ Incident deleted:', id)
      return saved
    } catch (error) {
      console.error('❌ Error deleting incident:', error)
      return false
    }
  },

  // Get incidents by type
  async getByType(type) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      return incidents.filter(incident => incident.type === type)
    } catch (error) {
      console.error('❌ Error getting incidents by type:', error)
      return []
    }
  },

  // Get incidents by date range
  async getByDateRange(startDate, endDate) {
    try {
      const db = getDB()
      const incidents = db.incidents || []
      return incidents.filter(incident => {
        const incidentDate = new Date(incident.timestamp || incident.date)
        return incidentDate >= startDate && incidentDate <= endDate
      })
    } catch (error) {
      console.error('❌ Error getting incidents by date range:', error)
      return []
    }
  }
}

// User settings operations
export const settingsDB = {
  async get(key) {
    try {
      const db = getDB()
      return db.userSettings?.[key] || null
    } catch (error) {
      console.error('❌ Error getting setting:', error)
      return null
    }
  },

  async set(key, value) {
    try {
      const db = getDB()
      if (!db.userSettings) {
        db.userSettings = {}
      }
      db.userSettings[key] = value
      
      const saved = saveDB(db)
      console.log('✅ Setting saved:', key, value)
      return saved
    } catch (error) {
      console.error('❌ Error saving setting:', error)
      return false
    }
  }
}

// Export database
export const exportDB = () => {
  try {
    const db = getDB()
    const dataStr = JSON.stringify(db, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `psychology-of-power-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ Database exported successfully')
  } catch (error) {
    console.error('❌ Error exporting database:', error)
  }
}

// Import database
export const importDB = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (saveDB(data)) {
            console.log('✅ Database imported successfully')
            resolve(true)
          } else {
            reject(new Error('Failed to save imported data'))
          }
        } catch (parseError) {
          reject(new Error('Invalid JSON format'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Clear all data
export const clearDB = () => {
  try {
    localStorage.removeItem(DB_NAME)
    console.log('✅ Database cleared successfully')
    return true
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    return false
  }
}
