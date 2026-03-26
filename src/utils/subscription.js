// Subscription management utilities
import { subscriptionDB, settingsDB } from './db'

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'До 5 інцидентів на місяць',
      'Базові шаблони скарг',
      'Калькулятор штрафів',
      'Дорожні знаки (офлайн)',
      'Базова юридична допомога'
    ],
    limitations: {
      incidentsPerMonth: 5,
      complaintTemplates: 10,
      cloudStorage: 0,
      prioritySupport: false
    }
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    price: 99,
    pricePeriod: 'місяць',
    features: [
      'Необмежена кількість інцидентів',
      'Хмарне зберігання на 30 днів',
      'Розширена база скарг (50+ шаблонів)',
      'Пріоритетна підтримка',
      'Автоматична відправка скарг',
      'Експорт даних в PDF/Word'
    ],
    limitations: {
      incidentsPerMonth: -1, // unlimited
      complaintTemplates: 50,
      cloudStorage: 30, // days
      prioritySupport: true
    }
  },
  premium: {
    id: 'premium',
    name: 'PREMIUM',
    price: 199,
    pricePeriod: 'місяць',
    features: [
      'Все з PRO плану',
      'Консультації юристів (2 на місяць)',
      'Персоналізовані шаблони скарг',
      'Аналіз інцидентів юристом',
      'Знижка 30% на представництво в суді',
      'Хмарне зберігання на 90 днів'
    ],
    limitations: {
      incidentsPerMonth: -1,
      complaintTemplates: -1,
      cloudStorage: 90,
      prioritySupport: true,
      legalConsultations: 2
    }
  }
}

// Check current subscription
export const checkSubscription = async () => {
  try {
    const activeSubscription = await subscriptionDB.getActive()
    
    if (activeSubscription) {
      // Check if subscription is still valid
      const now = new Date()
      const endDate = new Date(activeSubscription.endDate)
      
      if (now <= endDate) {
        return {
          ...activeSubscription,
          plan: SUBSCRIPTION_PLANS[activeSubscription.planId],
          isValid: true
        }
      } else {
        // Subscription expired, update status
        try {
          await subscriptionDB.update({
            ...activeSubscription,
            status: 'expired'
          })
        } catch (updateError) {
          console.error('Error updating expired subscription:', updateError)
        }
      }
    }
    
    // Return free plan as default
    return {
      id: 'free-default',
      planId: 'free',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: null,
      plan: SUBSCRIPTION_PLANS.free,
      isValid: true
    }
    
  } catch (error) {
    console.error('Error checking subscription:', error)
    // Return free plan as fallback
    return {
      id: 'free-default',
      planId: 'free',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: null,
      plan: SUBSCRIPTION_PLANS.free,
      isValid: true
    }
  }
}

// Check feature availability
export const checkFeatureAccess = async (feature) => {
  const subscription = await checkSubscription()
  
  switch (feature) {
    case 'unlimited_incidents':
      return subscription.plan.limitations.incidentsPerMonth === -1
    
    case 'cloud_storage':
      return subscription.plan.limitations.cloudStorage > 0
    
    case 'priority_support':
      return subscription.plan.limitations.prioritySupport
    
    case 'legal_consultations':
      return subscription.plan.limitations.legalConsultations > 0
    
    case 'advanced_complaints':
      return subscription.plan.limitations.complaintTemplates > 10
    
    default:
      return true
  }
}

// Check incident limit
export const checkIncidentLimit = async () => {
  const subscription = await checkSubscription()
  
  if (subscription.plan.limitations.incidentsPerMonth === -1) {
    return { allowed: true, remaining: -1 }
  }
  
  // Count incidents this month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  try {
    const { incidentsDB } = await import('./db')
    const incidents = await incidentsDB.getAll()
    const thisMonthIncidents = incidents.filter(incident => {
      const incidentDate = new Date(incident.timestamp)
      return incidentDate >= firstDayOfMonth
    })
    
    const remaining = subscription.plan.limitations.incidentsPerMonth - thisMonthIncidents.length
    
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      current: thisMonthIncidents.length,
      limit: subscription.plan.limitations.incidentsPerMonth
    }
  } catch (error) {
    console.error('Error checking incident limit:', error)
    return { allowed: true, remaining: -1 }
  }
}

// Create subscription
export const createSubscription = async (planId, paymentMethod) => {
  const plan = SUBSCRIPTION_PLANS[planId]
  
  if (!plan) {
    throw new Error('Invalid subscription plan')
  }
  
  const subscription = {
    id: Date.now().toString(),
    planId,
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    paymentMethod,
    autoRenew: true,
    createdAt: new Date().toISOString()
  }
  
  try {
    await subscriptionDB.add(subscription)
    
    // Save user preference
    await settingsDB.set('lastSubscriptionPlan', planId)
    
    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await subscriptionDB.getById(subscriptionId)
    
    if (!subscription) {
      throw new Error('Subscription not found')
    }
    
    // Update subscription to cancel at end of period
    await subscriptionDB.update({
      ...subscription,
      autoRenew: false,
      status: 'canceled',
      canceledAt: new Date().toISOString()
    })
    
    return true
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

// Upgrade subscription
export const upgradeSubscription = async (newPlanId, paymentMethod) => {
  try {
    const currentSubscription = await subscriptionDB.getActive()
    
    // Create new subscription
    const newSubscription = await createSubscription(newPlanId, paymentMethod)
    
    // Cancel old subscription if exists
    if (currentSubscription && currentSubscription.planId !== 'free') {
      await cancelSubscription(currentSubscription.id)
    }
    
    return newSubscription
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    throw error
  }
}

// Promocode management
export const validatePromocode = async (code) => {
  // This would typically connect to a backend service
  // For now, we'll use some hardcoded examples
  
  const promocodes = {
    'START2024': {
      discount: 50,
      type: 'percentage',
      validUntil: new Date('2024-12-31'),
      usageLimit: 1000,
      currentUsage: 234,
      plans: ['pro', 'premium']
    },
    'FREE30': {
      discount: 30,
      type: 'days',
      validUntil: new Date('2024-06-30'),
      usageLimit: 500,
      currentUsage: 123,
      plans: ['pro', 'premium']
    }
  }
  
  const promo = promocodes[code.toUpperCase()]
  
  if (!promo) {
    return { valid: false, error: 'Промокод не знайдено' }
  }
  
  if (new Date() > promo.validUntil) {
    return { valid: false, error: 'Промокод застарів' }
  }
  
  if (promo.currentUsage >= promo.usageLimit) {
    return { valid: false, error: 'Ліміт використання промокоду вичерпано' }
  }
  
  return {
    valid: true,
    discount: promo.discount,
    type: promo.type,
    applicablePlans: promo.plans
  }
}

// Apply promocode to subscription
export const applyPromocode = async (planId, promocode) => {
  const validation = await validatePromocode(promocode)
  
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  const plan = SUBSCRIPTION_PLANS[planId]
  
  if (!validation.applicablePlans.includes(planId)) {
    throw new Error('Промокод не застосовується до цього плану')
  }
  
  let adjustedPrice = plan.price
  
  if (validation.type === 'percentage') {
    adjustedPrice = plan.price * (1 - validation.discount / 100)
  } else if (validation.type === 'days') {
    // For free days, we'll handle this in the subscription creation
    adjustedPrice = plan.price
  }
  
  return {
    originalPrice: plan.price,
    discountedPrice: adjustedPrice,
    discount: plan.price - adjustedPrice,
    promocode,
    promoType: validation.type
  }
}

// Get subscription statistics
export const getSubscriptionStats = async () => {
  const subscription = await checkSubscription()
  const incidentLimit = await checkIncidentLimit()
  
  return {
    currentPlan: subscription.plan.name,
    planId: subscription.planId,
    incidentsUsed: incidentLimit.current || 0,
    incidentsLimit: incidentLimit.limit,
    incidentsRemaining: incidentLimit.remaining,
    subscriptionEnds: subscription.endDate,
    isPro: subscription.planId !== 'free',
    features: subscription.plan.features
  }
}
