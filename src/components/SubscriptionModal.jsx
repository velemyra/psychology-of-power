import React, { useState } from 'react'
import { X, Crown, Check, CreditCard, Gift } from 'lucide-react'
import { SUBSCRIPTION_PLANS, validatePromocode, applyPromocode } from '../utils/subscription'

const SubscriptionModal = ({ onClose, currentSubscription }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [promocode, setPromocode] = useState('')
  const [promoValidation, setPromoValidation] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
    setPromoValidation(null)
    setPromocode('')
  }

  const validatePromoCode = async () => {
    if (!promocode.trim()) {
      setPromoValidation({ valid: false, error: 'Введіть промокод' })
      return
    }

    try {
      const validation = await validatePromocode(promocode)
      const plan = SUBSCRIPTION_PLANS[selectedPlan]
      
      if (validation.valid && !validation.applicablePlans.includes(selectedPlan)) {
        setPromoValidation({ 
          valid: false, 
          error: 'Промокод не застосовується до обраного плану' 
        })
        return
      }

      if (validation.valid) {
        const appliedPromo = await applyPromocode(selectedPlan, promocode)
        setPromoValidation({ ...validation, ...appliedPromo })
      } else {
        setPromoValidation(validation)
      }
    } catch (error) {
      setPromoValidation({ valid: false, error: 'Помилка валідації промокоду' })
    }
  }

  const handleSubscribe = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with actual payment provider
      // For now, we'll just close the modal
      alert('Підписка успішно оформлена! (Демо режим)')
      onClose()
    } catch (error) {
      alert('Помилка при оформленні підписки')
    } finally {
      setIsProcessing(false)
    }
  }

  const getPlanPrice = (planId) => {
    const plan = SUBSCRIPTION_PLANS[planId]
    let price = plan.price
    
    if (promoValidation?.valid && promoValidation.type === 'percentage') {
      price = promoValidation.discountedPrice
    }
    
    return price
  }

  const getPlanDisplayPrice = (planId) => {
    const price = getPlanPrice(planId)
    if (price === 0) return 'Безкоштовно'
    return `${price} грн/${plan.pricePeriod || 'місяць'}`
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crown size={24} style={{ color: 'var(--warning-color)' }} />
            Оберіть план підписки
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#666', textAlign: 'center' }}>
            Отримайте повний доступ до всіх функцій додатку
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display: 'grid',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => {
            const isSelected = selectedPlan === planId
            const isCurrentPlan = currentSubscription?.planId === planId
            const price = getPlanPrice(planId)
            const hasDiscount = promoValidation?.valid && isSelected && price < plan.price

            return (
              <div
                key={planId}
                onClick={() => !isCurrentPlan && handlePlanSelect(planId)}
                style={{
                  border: isSelected ? '3px solid var(--primary-color)' : '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '25px',
                  cursor: isCurrentPlan ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  background: isSelected ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'white',
                  position: 'relative',
                  opacity: isCurrentPlan ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentPlan) {
                    e.target.style.transform = 'translateY(-4px)'
                    e.target.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentPlan) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              >
                {isCurrentPlan && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'var(--success-color)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ПОТОЧНИЙ ПЛАН
                  </div>
                )}

                {hasDiscount && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'var(--danger-color)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    -{promoValidation.discount} грн
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h3 style={{
                      margin: 0,
                      color: isSelected ? 'var(--primary-color)' : 'var(--dark-color)',
                      fontSize: '1.5rem'
                    }}>
                      {plan.name}
                    </h3>
                    {plan.pricePeriod && (
                      <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                        {plan.pricePeriod}
                      </p>
                    )}
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: isSelected ? 'var(--primary-color)' : 'var(--dark-color)'
                    }}>
                      {getPlanDisplayPrice(planId)}
                    </div>
                    {hasDiscount && (
                      <div style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '14px'
                      }}>
                        {plan.price} грн/місяць
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '10px'
                }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#666'
                    }}>
                      <Check size={16} style={{ color: 'var(--success-color)' }} />
                      <span style={{ fontSize: '14px' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Promocode Section */}
        <div style={{
          background: 'var(--light-color)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => setShowPromoInput(!showPromoInput)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
              fontWeight: '600',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Gift size={20} />
            {showPromoInput ? 'Сховати' : 'Маю промокод'}
          </button>

          {showPromoInput && (
            <div style={{
              marginTop: '20px',
              display: 'grid',
              gap: '15px'
            }}>
              <input
                type="text"
                placeholder="Введіть промокод"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                style={{
                  padding: '12px 15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              
              <button
                className="btn btn-outline"
                onClick={validatePromoCode}
                disabled={!promocode.trim()}
                style={{ width: '100%' }}
              >
                Застосувати промокод
              </button>

              {promoValidation && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: promoValidation.valid ? 'var(--success-color)' : 'var(--danger-color)',
                  color: 'white',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {promoValidation.valid 
                    ? `Промокод застосовано! Знижка ${promoValidation.discount}${promoValidation.type === 'percentage' ? '%' : ' днів'}`
                    : promoValidation.error
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          <button
            className="btn btn-primary"
            onClick={handleSubscribe}
            disabled={isProcessing || currentSubscription?.planId === selectedPlan}
            style={{
              fontSize: '18px',
              padding: '15px',
              fontWeight: 'bold'
            }}
          >
            {isProcessing ? (
              <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
            ) : currentSubscription?.planId === selectedPlan ? (
              'Цей план вже активний'
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CreditCard size={20} />
                Оплатити {getPlanPrice(selectedPlan)} грн
              </span>
            )}
          </button>

          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Скасувати
          </button>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#0369a1',
          textAlign: 'center'
        }}>
          🔒 Безпечна оплата через LiqPay. Ваші дані захищені.
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
