// IndexedDB utility functions for offline storage
import { openDB, deleteDB } from 'idb'

const DB_NAME = 'PsychologyOfPowerDB'
const DB_VERSION = 1

// Database schema
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
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Incidents store
        if (!db.objectStoreNames.contains(STORES.incidents)) {
          const incidentStore = db.createObjectStore(STORES.incidents, { keyPath: 'id' })
          incidentStore.createIndex('timestamp', 'timestamp')
          incidentStore.createIndex('type', 'type')
        }

        // Complaints store
        if (!db.objectStoreNames.contains(STORES.complaints)) {
          const complaintStore = db.createObjectStore(STORES.complaints, { keyPath: 'id' })
          complaintStore.createIndex('timestamp', 'timestamp')
          complaintStore.createIndex('type', 'type')
        }

        // Evidence store
        if (!db.objectStoreNames.contains(STORES.evidence)) {
          const evidenceStore = db.createObjectStore(STORES.evidence, { keyPath: 'id' })
          evidenceStore.createIndex('timestamp', 'timestamp')
          evidenceStore.createIndex('incidentId', 'incidentId')
        }

        // Fines cache store
        if (!db.objectStoreNames.contains(STORES.fines)) {
          db.createObjectStore(STORES.fines, { keyPath: 'id' })
        }

        // Road signs cache store
        if (!db.objectStoreNames.contains(STORES.roadSigns)) {
          db.createObjectStore(STORES.roadSigns, { keyPath: 'id' })
        }

        // User settings store
        if (!db.objectStoreNames.contains(STORES.userSettings)) {
          db.createObjectStore(STORES.userSettings, { keyPath: 'key' })
        }

        // Subscriptions store
        if (!db.objectStoreNames.contains(STORES.subscriptions)) {
          db.createObjectStore(STORES.subscriptions, { keyPath: 'id' })
        }
      }
    })

    return db
  } catch (error) {
    console.error('Error initializing database:', error)
    // Fallback: try to delete and recreate database
    try {
      await deleteDB(DB_NAME)
      return await initDB()
    } catch (deleteError) {
      console.error('Error recreating database:', deleteError)
      throw new Error('Failed to initialize database')
    }
  }
}

// Get database instance
export const getDB = async () => {
  try {
    return await openDB(DB_NAME, DB_VERSION)
  } catch (error) {
    console.error('Error getting database:', error)
    // Try to initialize database first
    return await initDB()
  }
}

// Incidents operations
export const incidentsDB = {
  // Add new incident
  async add(incident) {
    const db = await getDB()
    return await db.add(STORES.incidents, incident)
  },

  // Get all incidents
  async getAll() {
    const db = await getDB()
    return await db.getAll(STORES.incidents)
  },

  // Get incident by ID
  async getById(id) {
    const db = await getDB()
    return await db.get(STORES.incidents, id)
  },

  // Update incident
  async update(incident) {
    const db = await getDB()
    return await db.put(STORES.incidents, incident)
  },

  // Delete incident
  async delete(id) {
    const db = await getDB()
    return await db.delete(STORES.incidents, id)
  },

  // Get incidents by type
  async getByType(type) {
    const db = await getDB()
    return await db.getAllFromIndex(STORES.incidents, 'type', type)
  },

  // Get incidents by date range
  async getByDateRange(startDate, endDate) {
    const db = await getDB()
    const incidents = await db.getAll(STORES.incidents)
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.timestamp)
      return incidentDate >= startDate && incidentDate <= endDate
    })
  }
}

// Complaints operations
export const complaintsDB = {
  async add(complaint) {
    const db = await getDB()
    return await db.add(STORES.complaints, complaint)
  },

  async getAll() {
    const db = await getDB()
    return await db.getAll(STORES.complaints)
  },

  async getById(id) {
    const db = await getDB()
    return await db.get(STORES.complaints, id)
  },

  async update(complaint) {
    const db = await getDB()
    return await db.put(STORES.complaints, complaint)
  },

  async delete(id) {
    const db = await getDB()
    return await db.delete(STORES.complaints, id)
  }
}

// Evidence operations
export const evidenceDB = {
  async add(evidence) {
    const db = await getDB()
    return await db.add(STORES.evidence, evidence)
  },

  async getAll() {
    const db = await getDB()
    return await db.getAll(STORES.evidence)
  },

  async getById(id) {
    const db = await getDB()
    return await db.get(STORES.evidence, id)
  },

  async getByIncidentId(incidentId) {
    const db = await getDB()
    return await db.getAllFromIndex(STORES.evidence, 'incidentId', incidentId)
  },

  async update(evidence) {
    const db = await getDB()
    return await db.put(STORES.evidence, evidence)
  },

  async delete(id) {
    const db = await getDB()
    return await db.delete(STORES.evidence, id)
  }
}

// User settings operations
export const settingsDB = {
  async get(key) {
    const db = await getDB()
    const result = await db.get(STORES.userSettings, key)
    return result ? result.value : null
  },

  async set(key, value) {
    const db = await getDB()
    return await db.put(STORES.userSettings, { key, value })
  },

  async getAll() {
    const db = await getDB()
    const allSettings = await db.getAll(STORES.userSettings)
    const settings = {}
    allSettings.forEach(setting => {
      settings[setting.key] = setting.value
    })
    return settings
  }
}

// Subscription operations
export const subscriptionDB = {
  async add(subscription) {
    const db = await getDB()
    return await db.add(STORES.subscriptions, subscription)
  },

  async getActive() {
    const db = await getDB()
    const allSubscriptions = await db.getAll(STORES.subscriptions)
    return allSubscriptions.find(sub => sub.status === 'active')
  },

  async update(subscription) {
    const db = await getDB()
    return await db.put(STORES.subscriptions, subscription)
  },

  async delete(id) {
    const db = await getDB()
    return await db.delete(STORES.subscriptions, id)
  }
}

// Export database for backup
export const exportDB = async () => {
  const db = await getDB()
  const data = {
    incidents: await incidentsDB.getAll(),
    complaints: await complaintsDB.getAll(),
    evidence: await evidenceDB.getAll(),
    settings: await settingsDB.getAll(),
    subscriptions: await db.getAll(STORES.subscriptions)
  }
  return data
}

// Import database from backup
export const importDB = async (data) => {
  const db = await getDB()
  
  // Clear all stores
  for (const store of Object.values(STORES)) {
    await db.clear(store)
  }
  
  // Import data
  if (data.incidents) {
    for (const incident of data.incidents) {
      await incidentsDB.add(incident)
    }
  }
  
  if (data.complaints) {
    for (const complaint of data.complaints) {
      await complaintsDB.add(complaint)
    }
  }
  
  if (data.evidence) {
    for (const evidence of data.evidence) {
      await evidenceDB.add(evidence)
    }
  }
  
  if (data.settings) {
    for (const [key, value] of Object.entries(data.settings)) {
      await settingsDB.set(key, value)
    }
  }
  
  if (data.subscriptions) {
    for (const subscription of data.subscriptions) {
      await subscriptionDB.add(subscription)
    }
  }
}

// Clear all data
export const clearDB = async () => {
  const db = await getDB()
  for (const store of Object.values(STORES)) {
    await db.clear(store)
  }
}
