import { useState } from 'react'
import GameSelection from './components/GameSelection'
import StockTickerQuiz from './components/StockTickerQuiz'
import Ticker100Start from './components/Ticker100Start'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleGameSelect = (gameId) => {
    if (gameId === 'ticker100') {
      setCurrentView('ticker100-start')
    }
    // 추후 다른 게임들 추가
  }

  const handleStartTicker100 = () => {
    setCurrentView('ticker100-game')
  }

  const handleGameEnd = () => {
    setCurrentView('home')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  if (currentView === 'home') {
    return <GameSelection onGameSelect={handleGameSelect} />
  }

  if (currentView === 'ticker100-start') {
    return (
      <Ticker100Start 
        onStartGame={handleStartTicker100}
        onBack={handleBackToHome}
      />
    )
  }

  if (currentView === 'ticker100-game') {
    return <StockTickerQuiz onGameEnd={handleGameEnd} />
  }

  return <GameSelection onGameSelect={handleGameSelect} />
}

export default App