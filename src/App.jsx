import { useState } from 'react'
import GameSelection from './components/GameSelection'
import StockTickerQuiz from './components/StockTickerQuiz'
import Ticker100Start from './components/Ticker100Start'
import InvestmentQuiz from './components/InvestmentQuiz'
import InvestQuizStart from './components/InvestQuizStart'
import WeeklyPortfolio from './components/WeeklyPortfolio'
import WeeklyPortfolioStart from './components/WeeklyPortfolioStart'

function App() {
  // GitHub Pages 경로에서 접근했을 때 해당 게임으로 이동
  const getInitialView = () => {
    if (window.location.pathname.includes('/game') || window.location.pathname.includes('game.html')) {
      return 'ticker100-start';
    } else if (window.location.pathname.includes('/quiz') || window.location.pathname.includes('quiz.html')) {
      return 'invest-quiz-start';
    }
    return 'home';
  };
  const initialView = getInitialView();
  const [currentView, setCurrentView] = useState(initialView)

  const handleGameSelect = (gameId) => {
    if (gameId === 'ticker100') {
      setCurrentView('ticker100-start')
    } else if (gameId === 'invest-quiz') {
      setCurrentView('invest-quiz-start')
    } else if (gameId === 'weekly-portfolio') {
      setCurrentView('weekly-portfolio-start')
    }
  }

  const handleStartTicker100 = () => {
    setCurrentView('ticker100-game')
  }

  const handleStartInvestQuiz = () => {
    setCurrentView('invest-quiz-game')
  }

  const handleStartWeeklyPortfolio = () => {
    setCurrentView('weekly-portfolio-game')
  }

  const handleGameEnd = () => {
    // GitHub Pages 경로에서는 메인 페이지로 이동
    if (window.location.pathname.includes('/game') || window.location.pathname.includes('game.html') || 
        window.location.pathname.includes('/quiz') || window.location.pathname.includes('quiz.html')) {
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

  if (currentView === 'invest-quiz-start') {
    return (
      <InvestQuizStart 
        onStartGame={handleStartInvestQuiz}
        onBack={handleBackToHome}
      />
    )
  }

  if (currentView === 'invest-quiz-game') {
    return <InvestmentQuiz onGameEnd={handleGameEnd} />
  }

  if (currentView === 'weekly-portfolio-start') {
    return (
      <WeeklyPortfolioStart 
        onStartGame={handleStartWeeklyPortfolio}
        onBack={handleBackToHome}
      />
    )
  }

  if (currentView === 'weekly-portfolio-game') {
    return <WeeklyPortfolio onGameEnd={handleGameEnd} />
  }

  return <GameSelection onGameSelect={handleGameSelect} />
}

export default App