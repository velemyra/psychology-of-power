import React from 'react'
import Header from './components/Header'
import EmergencyMode from './components/EmergencyMode'
import Incidents from './components/Incidents'
import Profile from './components/Profile'
import Menu from './components/Menu'

function App() {
  const [currentPage, setCurrentPage] = React.useState('emergency')

  const renderPage = () => {
    switch(currentPage) {
      case 'emergency':
        return <EmergencyMode />
      case 'incidents':
        return <Incidents />
      case 'profile':
        return <Profile />
      default:
        return <EmergencyMode />
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {renderPage()}
      </main>
      <Menu currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App
