// Subscription management utilities for Psychology of Power V2

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'basic_incidents',
      'limited_storage',
      'basic_complaints'
    ],
    limits: {
      incidents: 10,
      storage: '100MB'
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    features: [
      'unlimited_incidents',
      'cloud_storage',
      'advanced_complaints',
      'priority_support',
      'legal_templates'
    ],
    limits: {
      incidents: 'unlimited',
      storage: '10GB'
    }
  }
}

// Check current subscription
export const checkSubscription = () => {
  try {
    const subscriptionData = localStorage.getItem('psychology-of-power-subscription')
    
    if (subscriptionData) {
      const subscription = JSON.parse(subscriptionData)
      
      // Check if subscription is still valid
      if (subscription.expiresAt && new Date(subscription.expiresAt) > new Date()) {
        return subscription
      }
    }
    
    // Default free subscription
    return {
      plan: 'free',
      status: 'active',
      expiresAt: null,
      features: SUBSCRIPTION_PLANS.free.features,
      limits: SUBSCRIPTION_PLANS.free.limits
    }
  } catch (error) {
    console.error('Error checking subscription:', error)
    return {
      plan: 'free',
      status: 'active',
      expiresAt: null,
      features: SUBSCRIPTION_PLANS.free.features,
      limits: SUBSCRIPTION_PLANS.free.limits
    }
  }
}

// Upgrade subscription
export const upgradeSubscription = (planId) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }
    
    const subscription = {
      plan: planId,
      status: 'active',
      expiresAt: planId === 'premium' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : // 30 days
        null,
      features: plan.features,
      limits: plan.limits,
      upgradedAt: new Date().toISOString()
    }
    
    localStorage.setItem('psychology-of-power-subscription', JSON.stringify(subscription))
    return subscription
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return null
  }
}

// Check if user can access feature
export const canAccessFeature = (feature, userSubscription) => {
  const subscription = userSubscription || checkSubscription()
  return subscription.features.includes(feature)
}

// Get subscription status with days left
export const getSubscriptionStatus = () => {
  const subscription = checkSubscription()
  
  if (subscription.plan === 'premium') {
    if (subscription.expiresAt) {
      const daysLeft = Math.ceil((new Date(subscription.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
      return {
        status: 'premium',
        daysLeft: daysLeft,
        expiresAt: subscription.expiresAt
      }
    }
    return {
      status: 'premium',
      daysLeft: 'unlimited',
      expiresAt: null
    }
  }
  
  return {
    status: 'free',
    daysLeft: null,
    expiresAt: null
  }
}

// Check storage limits
export const checkStorageLimit = (currentSize, userSubscription) => {
  const subscription = userSubscription || checkSubscription()
  const limit = subscription.limits.storage
  
  if (limit === 'unlimited') {
    return { canStore: true, used: currentSize, limit: 'unlimited' }
  }
  
  const limitInBytes = parseStorageLimit(limit)
  return {
    canStore: currentSize < limitInBytes,
    used: currentSize,
    limit: limitInBytes,
    remaining: limitInBytes - currentSize
  }
}

// Parse storage limit string to bytes
function parseStorageLimit(limit) {
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024
  }
  
  const match = limit.match(/^(\d+)(B|KB|MB|GB)$/)
  if (!match) return 0
  
  const [, size, unit] = match
  return parseInt(size) * units[unit]
}

// Check incident limit for user
export const checkIncidentLimit = (userSubscription) => {
  const subscription = userSubscription || checkSubscription()
  const limit = subscription.limits.incidents
  
  if (limit === 'unlimited') {
    return { canCreate: true, used: 0, limit: 'unlimited' }
  }
  
  // Get current incident count from localStorage
  try {
    const incidents = JSON.parse(localStorage.getItem('PsychologyOfPowerV2') || '{}').incidents || []
    const used = incidents.length
    
    return {
      canCreate: used < limit,
      used: used,
      limit: limit,
      remaining: limit - used
    }
  } catch (error) {
    console.error('Error checking incident limit:', error)
    return { canCreate: true, used: 0, limit: limit }
  }
}

// Check if user can access specific feature
export const checkFeatureAccess = (feature, userSubscription) => {
  return canAccessFeature(feature, userSubscription)
}

// Get subscription statistics
export const getSubscriptionStats = (userSubscription) => {
  const subscription = userSubscription || checkSubscription()
  const status = getSubscriptionStatus()
  
  // Get current usage stats
  let incidentsUsed = 0
  let storageUsed = 0
  
  try {
    const dbData = JSON.parse(localStorage.getItem('PsychologyOfPowerV2') || '{}')
    incidentsUsed = dbData.incidents ? dbData.incidents.length : 0
    
    // Calculate storage size (rough estimate)
    const dbString = JSON.stringify(dbData)
    storageUsed = new Blob([dbString]).size
  } catch (error) {
    console.error('Error getting subscription stats:', error)
  }
  
  return {
    plan: subscription.plan,
    status: status.status,
    daysLeft: status.daysLeft,
    expiresAt: status.expiresAt,
    limits: subscription.limits,
    usage: {
      incidents: incidentsUsed,
      storage: storageUsed
    },
    features: subscription.features
  }
}

// Promocode validation
export const validatePromocode = (code) => {
  const promocodes = {
    'PREMIUM2024': {
      valid: true,
      discount: 50,
      plan: 'premium',
      duration: 30 // days
    },
    'DEMO': {
      valid: true,
      discount: 100,
      plan: 'premium',
      duration: 7 // days
    },
    'TEST': {
      valid: true,
      discount: 25,
      plan: 'premium',
      duration: 14 // days
    }
  }
  
  const promo = promocodes[code.toUpperCase()]
  
  if (!promo) {
    return {
      valid: false,
      error: 'Невідомий промокод'
    }
  }
  
  return {
    valid: true,
    discount: promo.discount,
    plan: promo.plan,
    duration: promo.duration,
    originalPrice: SUBSCRIPTION_PLANS[promo.plan].price,
    discountedPrice: promo.discount === 100 ? 0 : SUBSCRIPTION_PLANS[promo.plan].price * (1 - promo.discount / 100)
  }
}

// Apply promocode to subscription
export const applyPromocode = (code, userSubscription) => {
  const validation = validatePromocode(code)
  
  if (!validation.valid) {
    return validation
  }
  
  const subscription = upgradeSubscription(validation.plan)
  
  if (subscription) {
    // Apply promocode metadata
    subscription.promocode = code.toUpperCase()
    subscription.discount = validation.discount
    subscription.originalPrice = validation.originalPrice
    subscription.discountedPrice = validation.discountedPrice
    
    return {
      success: true,
      subscription: subscription
    }
  }
  
  return {
    success: false,
    error: 'Не вдалося застосувати промокод'
  }
}
