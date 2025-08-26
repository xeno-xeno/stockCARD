import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target } from 'lucide-react';
import { stockData } from '../data/stockData';

const StockTickerQuiz = () => {
  // 주식 데이터는 별도 파일에서 import

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(() => {
    const saved = localStorage.getItem('stockQuizMaxStreak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctTickers, setCorrectTickers] = useState(new Set());

  // 새 문제 생성 (중복 방지)
  const generateQuestion = () => {
    // 맞춘 적 없는 종목들 필터링
    const availableStocks = stockData.filter(stock => !correctTickers.has(stock.ticker));
    
    // 모든 종목을 맞춘 경우 게임 완료
    if (availableStocks.length === 0) {
      setGameOver(true);
      return;
    }
    
    const correct = availableStocks[Math.floor(Math.random() * availableStocks.length)];
    const incorrectOptions = stockData
      .filter(stock => stock.name !== correct.name)
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
      const newScore = score + 1;
      setScore(newScore);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => {
          const newMax = Math.max(current, newStreak);
          localStorage.setItem('stockQuizMaxStreak', newMax.toString());
          return newMax;
        });
        return newStreak;
      });
      
      // 100개 연속 정답 달성 시 게임 완료
      if (newScore === 100) {
        setGameOver(true);
        return;
      }
      
      // 맞춘 종목을 Set에 추가 (달성률 계산용)
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


  // 카운트다운 useEffect
  useEffect(() => {
    let timer;
    if (autoAdvance && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 500);
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
      <div className="max-w-2xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">도전 티커 100!</h1>
          </div>
          
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            티커(Ticker)를 보고<br />
            올바른 회사명을 맞춰보세요!
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">게임 방법</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• 티커(예: AAPL)가 주어집니다</li>
              <li>• 3개의 선택지 중 올바른 회사명을 고르세요</li>
              <li>• 연속으로 100개를 맞추면 승리!</li>
              <li>• 틀리면 게임 오버!</li>
              <li>• S&P500 종목이 출제됩니다</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Trophy size={20} />
            게임 시작하기
          </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-auto py-3 w-full">
          <div className="text-xs text-gray-400">
            powered by 초이스스탁
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-2 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      
      {/* 헤더 & 점수 */}
      <div className="bg-white rounded-2xl p-3 mb-2 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-1">
            <Target className="text-blue-600" size={16} />
            도전 티커 100!
          </h1>
          <button
            onClick={resetGame}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Shuffle size={12} />
            게임 종료
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-base font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">연속정답</div>
          </div>
          <div>
            <div className="text-base font-bold text-gray-700">500+</div>
            <div className="text-xs text-gray-500">전체종목</div>
          </div>
          <div>
            <div className="text-base font-bold text-orange-600">{maxStreak}</div>
            <div className="text-xs text-gray-500">내 최고기록</div>
          </div>
        </div>

      </div>

      {/* 문제 카드 */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-3 shadow-lg flex-1">
          
          {/* 티커 표시 */}
          <div className="text-center mb-6 mt-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl mb-3">
              <div className="text-2xl font-bold font-mono">{currentQuestion.ticker}</div>
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.sector} 섹터
            </div>
            <p className="text-base text-gray-700 mt-2">이 티커의 회사명은?</p>
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
                  <div className="flex flex-col items-center justify-center min-h-[55px] md:min-h-[110px]">
                    <span className="text-base text-center font-semibold">{option.name}</span>
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
            <div className="mt-1 text-center">
              <div className={`p-1.5 rounded-lg mb-1.5 ${
                selectedAnswer?.name === currentQuestion.correctAnswer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer?.name === currentQuestion.correctAnswer ? (
                  <div>
                    <div className="text-sm font-bold">🎉 정답!</div>
                    {streak > 1 && <div className="text-xs">🔥 {streak}연속!</div>}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold mb-0.5">❌ 틀렸습니다</div>
                    <div className="text-xs mb-1">정답: {currentQuestion.correctAnswer}</div>
                    <a 
                      href={`https://www.choicestock.co.kr/search/summary/${currentQuestion.ticker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-xs"
                    >
                      🔍 종목정보
                    </a>
                  </div>
                )}
              </div>
              
              {gameOver ? (
                <div className="space-y-1.5">
                  <div className="text-center">
                    {score === 100 ? (
                      <div>
                        <div className="text-lg font-bold text-yellow-600 mb-1">🎉 축하! 🎉</div>
                        <div className="text-base font-bold text-green-600 mb-0.5">100연속 달성!</div>
                        <div className="text-xs text-gray-600">티커 마스터! 🏆</div>
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={startGame}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-1 mx-auto text-sm"
                  >
                    <Trophy size={14} />
                    다시 도전
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 mx-auto text-sm"
                >
                  {countdown > 0 ? `다음 (${countdown})` : '다음'}
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-auto py-2">
        <div className="text-xs text-gray-400">
          powered by 초이스스탁
        </div>
      </div>

    </div>
  );
};

export default StockTickerQuiz;