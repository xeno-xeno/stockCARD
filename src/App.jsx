import { useState } from 'react'
import GameSelection from './components/GameSelection'
import StockTickerQuiz from './components/StockTickerQuiz'
import Ticker100Start from './components/Ticker100Start'

function App() {
  // GitHub Pages /game/ 경로에서 접근했을 때 소개 페이지로 이동
  const initialView = window.location.pathname.includes('/game') ? 'ticker100-start' : 'home';
  const [currentView, setCurrentView] = useState(initialView)

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
    // /game/ 경로에서는 메인 페이지로 이동
    if (window.location.pathname.includes('/game')) {
      window.location.href = '/stockCARD/';
    } else {
      setCurrentView('home');
    }
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