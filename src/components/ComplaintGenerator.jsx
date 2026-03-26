import React, { useState } from 'react'
import { FileText, Download, Send, Clock, User, AlertCircle } from 'lucide-react'

const ComplaintGenerator = ({ userSubscription }) => {
  const [complaintType, setComplaintType] = useState('')
  const [complaintData, setComplaintData] = useState({
    officerName: '',
    officerRank: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    witnesses: '',
    evidence: ''
  })

  const complaintTypes = [
    { id: 'police_abuse', name: 'Перевищення повноважень поліцією' },
    { id: 'illegal_stop', name: 'Незаконна зупинка транспортного засобу' },
    { id: 'protocol_error', name: 'Помилки в протоколі' },
    { id: 'rights_violation', name: 'Порушення прав водія' }
  ]

  const handleInputChange = (field, value) => {
    setComplaintData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const downloadComplaint = () => {
    const text = `Скарга від ${new Date().toLocaleDateString()}\n\nТип: ${complaintType}\nПоліцейський: ${complaintData.officerName}\nОпис: ${complaintData.description}`
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `скарга_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div className="container">
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: 'var(--primary-color)',
            marginBottom: '30px',
            textAlign: 'center',
            fontSize: '2rem'
          }}>
            📝 Генератор скарг
          </h2>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: 'var(--dark-color)'
            }}>
              Тип скарги:
            </label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px'
              }}
            >
              <option value="">Оберіть тип скарги</option>
              {complaintTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <User size={20} />
              Дані про поліцейського
            </h3>
            
            <input
              type="text"
              placeholder="ПІБ поліцейського"
              value={complaintData.officerName}
              onChange={(e) => handleInputChange('officerName', e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px',
                marginBottom: '15px'
              }}
            />
            
            <input
              type="text"
              placeholder="Посада"
              value={complaintData.officerRank}
              onChange={(e) => handleInputChange('officerRank', e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: 'var(--dark-color)',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Clock size={20} />
              Обставини інциденту
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input
                type="date"
                value={complaintData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid var(--light-color)',
                  fontSize: '16px'
                }}
              />
              
              <input
                type="time"
                value={complaintData.incidentTime}
                onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid var(--light-color)',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <input
              type="text"
              placeholder="Місце події"
              value={complaintData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px',
                marginTop: '15px'
              }}
            />
            
            <textarea
              placeholder="Детальний опис інциденту"
              value={complaintData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid var(--light-color)',
                fontSize: '16px',
                marginTop: '15px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <button
              onClick={downloadComplaint}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Download size={20} />
              Завантажити скаргу
            </button>
            
            <button
              onClick={() => alert('Скаргу відправлено!')}
              className="btn btn-success"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Send size={20} />
              Відправити скаргу
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintGenerator
