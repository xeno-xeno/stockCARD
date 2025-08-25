import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target } from 'lucide-react';
import { stockData } from '../data/stockData.jsx';

const StockTickerQuiz = () => {
  // 주식 데이터는 별도 파일에서 import

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctTickers, setCorrectTickers] = useState(new Set());

  // 새 문제 생성 (맞춘 종목 제외)
  const generateQuestion = () => {
    // 맞추지 않은 종목들만 필터링
    const availableStocks = stockData.filter(stock => !correctTickers.has(stock.ticker));
    
    // 모든 종목을 다 맞췄다면 게임 완료
    if (availableStocks.length === 0) {
      setGameOver(true);
      return;
    }
    
    const correct = availableStocks[Math.floor(Math.random() * availableStocks.length)];
    const incorrectOptions = stockData
      .filter(stock => stock.ticker !== correct.ticker)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const options = [correct, ...incorrectOptions].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      ticker: correct.ticker,
      sector: correct.sector,
      correctAnswer: correct.name,
      options: options
    });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (selectedOption) => {
    if (showResult) return;
    
    setSelectedAnswer(selectedOption);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (selectedOption.name === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      // 맞춘 종목을 Set에 추가
      setCorrectTickers(prev => new Set([...prev, currentQuestion.ticker]));
      // 정답일 때만 자동 진행 카운트다운 시작
      setAutoAdvance(true);
      setCountdown(3);
    } else {
      setStreak(0);
      // 오답일 때 게임 오버
      setGameOver(true);
    }
  };

  const nextQuestion = () => {
    setAutoAdvance(false);
    setCountdown(0);
    generateQuestion();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setAutoAdvance(false);
    setCountdown(0);
    generateQuestion();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentQuestion(null);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setMaxStreak(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAutoAdvance(false);
    setCountdown(0);
    setCorrectTickers(new Set());
  };

  const getCoveragePercentage = () => {
    return stockData.length > 0 ? ((correctTickers.size / stockData.length) * 100).toFixed(1) : 0;
  };

  // 카운트다운 useEffect
  useEffect(() => {
    let timer;
    if (autoAdvance && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (autoAdvance && countdown === 0) {
      nextQuestion();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoAdvance, countdown]);

  // 시작 화면
  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="text-blue-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-800">주식 티커 퀴즈</h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            미국 주식의 티커(Ticker)를 보고<br />
            올바른 회사명을 맞춰보세요!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-700 mb-4">게임 방법</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• 티커(예: AAPL)가 주어집니다</li>
              <li>• 3개의 선택지 중 올바른 회사명을 고르세요</li>
              <li>• 최대한 많은 종목을 연속으로 맞춰보세요!</li>
              <li>• S&P500 종목이 출제됩니다</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Trophy size={24} />
            게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      
      {/* 헤더 & 점수 */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="text-blue-600" />
            주식 티커 퀴즈
          </h1>
          <button
            onClick={resetGame}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Shuffle size={16} />
            게임 종료
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">연속정답</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">500+</div>
            <div className="text-xs text-gray-500">전체종목</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{getCoveragePercentage()}%</div>
            <div className="text-xs text-gray-500">달성률</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
            <div className="text-xs text-gray-500">최고연속</div>
          </div>
        </div>

      </div>

      {/* 문제 카드 */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          
          {/* 티커 표시 */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-xl mb-4">
              <div className="text-4xl font-mono font-bold">{currentQuestion.ticker}</div>
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.sector} 섹터
            </div>
            <p className="text-lg text-gray-700 mt-2">이 티커의 회사명은?</p>
          </div>

          {/* 선택지 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "p-4 rounded-xl text-center font-medium transition-all duration-200 border-2 ";
              
              if (!showResult) {
                buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white";
              } else {
                if (option.name === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-100 text-green-800";
                } else if (selectedAnswer?.name === option.name) {
                  buttonClass += "border-red-500 bg-red-100 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex flex-col items-center justify-center min-h-[80px]">
                    <span className="text-lg">{option.name}</span>
                    {showResult && option.name === currentQuestion.correctAnswer && (
                      <span className="text-green-600 font-bold text-xl mt-2">✓</span>
                    )}
                    {showResult && selectedAnswer?.name === option.name && option.name !== currentQuestion.correctAnswer && (
                      <span className="text-red-600 font-bold text-xl mt-2">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 결과 표시 */}
          {showResult && (
            <div className="mt-6 text-center">
              <div className={`p-4 rounded-lg mb-4 ${
                selectedAnswer?.name === currentQuestion.correctAnswer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer?.name === currentQuestion.correctAnswer ? (
                  <div>
                    <div className="text-xl font-bold mb-1">🎉 정답입니다!</div>
                    {streak > 1 && <div className="text-sm">🔥 {streak}연속 정답!</div>}
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold mb-1">❌ 틀렸습니다</div>
                    <div className="text-sm mb-2">정답: {currentQuestion.correctAnswer}</div>
                    <a 
                      href={`https://www.choicestock.co.kr/search/summary/${currentQuestion.ticker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      🔍 {currentQuestion.correctAnswer} 종목 알아보기
                    </a>
                  </div>
                )}
              </div>
              
              {gameOver ? (
                <div className="space-y-4">
                  <div className="text-center">
                    {correctTickers.size === stockData.length ? (
                      <div>
                        <div className="text-3xl font-bold text-yellow-600 mb-2">🏆 완벽!</div>
                        <div className="text-lg text-gray-600 mb-2">모든 종목을 정복했습니다!</div>
                        <div className="text-sm text-gray-500">총 {stockData.length}개 종목 완료</div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-800 mb-2">🎯 게임 종료!</div>
                    )}
                  </div>
                  <button
                    onClick={startGame}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Trophy size={20} />
                    다시 도전하기
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  {countdown > 0 ? `다음 문제 (${countdown})` : '다음 문제'}
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 하단 안내 */}
      {!showResult && currentQuestion && (
        <div className="text-center mt-6 text-gray-600 text-sm">
          위 3개의 선택지 중 하나를 클릭하세요
        </div>
      )}
    </div>
  );
};

export default StockTickerQuiz;