import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target, X } from 'lucide-react';
import { investQuizData } from '../data/investQuizData';
import { getDifficultyLabel, QUIZ_CONFIG, getTodayQuiz } from '../utils/dailyQuizGenerator';

const InvestmentQuiz = ({ onGameEnd }) => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '매일 투자지식 한스푼 - StockGame';
    return () => {
      document.title = 'StockGame'; // 컴포넌트 언마운트 시 원래 타이틀로 복원
    };
  }, []);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(true);
  const [todayCard, setTodayCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 오늘의 카드 로드 (랜덤 1개)
  const loadTodayCard = async () => {
    setIsLoading(true);
    try {
      // 전체 데이터에서 랜덤하게 1개 선택
      const randomIndex = Math.floor(Math.random() * investQuizData.length);
      const quiz = investQuizData[randomIndex];
      
      const formattedCard = {
        id: quiz.id,
        category: quiz.category,
        difficulty: quiz.difficulty,
        question: quiz.question,
        options: [
          { text: quiz.option1, isCorrect: quiz.answer === 1 },
          { text: quiz.option2, isCorrect: quiz.answer === 2 }
        ].sort(() => Math.random() - 0.5), // 순서 섞기
        correctAnswer: quiz.answer,
        tip: quiz.tip
      };
      setTodayCard(formattedCard);
    } catch (error) {
      console.error('오늘의 카드 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedOption) => {
    if (showResult) return;
    
    setSelectedAnswer(selectedOption);
    setShowResult(true);
  };

  const getNewCard = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    loadTodayCard();
  };

  const startGame = () => {
    setGameStarted(true);
    setSelectedAnswer(null);
    setShowResult(false);
    loadTodayCard();
  };

  const resetGame = () => {
    if (onGameEnd) {
      onGameEnd();
    }
  };

  // 컴포넌트 마운트 시 오늘의 카드 로드
  useEffect(() => {
    loadTodayCard();
  }, []);


  // 컴포넌트 props로 게임 시작 제어
  if (!gameStarted) {
    startGame();
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">{/* 카드 컨테이너 */}

        {/* 로딩 또는 지식 카드 */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-600 mb-2">오늘의 지식 카드를 준비하고 있어요...</div>
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        ) : todayCard ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            
            {/* 카드 헤더 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Target className="text-green-600" size={20} />
                <h1 className="text-lg font-bold text-gray-800">매일 투자지식 한스푼</h1>
              </div>
              <button
                onClick={onGameEnd || resetGame}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 지식 카드 내용 */}
            <div className="text-center mb-6">
              <div className="flex justify-center gap-2 mb-4">
                <div className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {todayCard.category}
                </div>
                <div className={`inline-block text-white px-3 py-1 rounded-full text-sm font-medium ${
                  todayCard.difficulty === 'E' ? 'bg-green-500' :
                  todayCard.difficulty === 'M' ? 'bg-yellow-600' : 'bg-red-500'
                }`}>
                  {getDifficultyLabel(todayCard.difficulty)}
                </div>
              </div>
              <div className="text-xl font-bold text-gray-800 leading-relaxed px-2 mb-4">
                {todayCard.question}
              </div>
            </div>

          {/* 선택지 */}
          <div className="grid grid-cols-1 gap-3">
            {todayCard.options.map((option, index) => {
              let buttonClass = "p-4 rounded-xl text-center font-medium transition-all duration-200 border-2 ";
              
              if (showResult) {
                if (option.isCorrect) {
                  buttonClass += "bg-green-100 border-green-400 text-green-800 ";
                } else if (selectedAnswer?.text === option.text) {
                  buttonClass += "bg-red-100 border-red-400 text-red-800 ";
                } else {
                  buttonClass += "bg-gray-50 border-gray-200 text-gray-500 ";
                }
              } else {
                buttonClass += "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer hover:shadow-md ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex flex-col items-center justify-center min-h-[60px] md:min-h-[70px]">
                    <span className="text-base text-center font-semibold">{option.text}</span>
                    {showResult && option.isCorrect && (
                      <span className="text-green-600 font-bold text-2xl mt-2">✓</span>
                    )}
                    {showResult && selectedAnswer?.text === option.text && !option.isCorrect && (
                      <span className="text-red-600 font-bold text-2xl mt-2">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 결과 및 지식 설명 표시 */}
          {showResult && (
            <div className="mt-6 text-center">
              <div className={`p-3 rounded-xl mb-4 ${
                selectedAnswer?.isCorrect 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {selectedAnswer?.isCorrect ? (
                  <div>
                    <div className="text-base font-bold">🎉 정답입니다!</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-base font-bold">💭 다시 생각해보세요</div>
                  </div>
                )}
              </div>
              
              {/* 정답/오답 상관없이 지식 설명 표시 */}
              {todayCard.tip && (
                <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-xl mt-4 whitespace-pre-line text-left border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">📚 투자 지식</div>
                  {todayCard.tip.replace(/(\s예:)/g, '\n예:')}
                </div>
              )}
              
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={getNewCard}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Shuffle size={14} />
                  새로운 지식
                </button>
                <button
                  onClick={() => window.open('https://www.choicestock.co.kr/stock/recipe_intro', '_blank')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Trophy size={14} />
                  나에게 맞는 종목발굴!
                </button>
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              powered by 초이스스탁
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center text-gray-600">
            <div className="text-lg font-medium mb-2">지식 카드를 불러올 수 없습니다</div>
            <div className="text-sm">잠시 후 다시 시도해주세요.</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InvestmentQuiz;