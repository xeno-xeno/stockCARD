import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target } from 'lucide-react';
import { investQuizData } from '../data/investQuizData';
import { getDifficultyLabel, QUIZ_CONFIG, getTodayQuiz } from '../utils/dailyQuizGenerator';

const InvestmentQuiz = ({ onGameEnd }) => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '매일투자퀴즈 5! - StockGame';
    return () => {
      document.title = 'StockGame'; // 컴포넌트 언마운트 시 원래 타이틀로 복원
    };
  }, []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [todayQuizzes, setTodayQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 오늘의 퀴즈 로드
  const loadTodayQuiz = async () => {
    setIsLoading(true);
    try {
      const dailyQuizResult = getTodayQuiz(investQuizData);
      const formattedQuizzes = dailyQuizResult.quizzes.map(quiz => ({
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
      }));
      setTodayQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('오늘의 퀴즈 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedOption) => {
    if (showResult) return;
    
    setSelectedAnswer(selectedOption);
    setShowResult(true);

    if (selectedOption.isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= todayQuizzes.length) {
      setGameOver(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
    loadTodayQuiz();
  };

  const resetGame = () => {
    if (onGameEnd) {
      onGameEnd();
    }
  };

  // 컴포넌트 마운트 시 오늘의 퀴즈 로드
  useEffect(() => {
    loadTodayQuiz();
  }, []);


  // 컴포넌트 props로 게임 시작 제어
  if (!gameStarted) {
    startGame();
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-2 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      
      {/* 헤더 & 점수 */}
      <div className="bg-white rounded-2xl p-3 mb-2 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-1">
            <Target className="text-blue-600" size={16} />
            매일투자퀴즈 5!
          </h1>
          <button
            onClick={onGameEnd || resetGame}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Shuffle size={12} />
            게임 종료
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-base font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">정답</div>
          </div>
          <div>
            <div className="text-base font-bold text-gray-700">{currentQuestionIndex + 1}/{QUIZ_CONFIG.daily_quiz_size}</div>
            <div className="text-xs text-gray-500">진행도</div>
          </div>
          <div>
            <div className="text-base font-bold text-green-600">{currentQuestionIndex > 0 ? Math.round((score/(currentQuestionIndex))*100) : 0}%</div>
            <div className="text-xs text-gray-500">정답률</div>
          </div>
        </div>
        
      </div>

      {/* 로딩 또는 문제 카드 */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-600 mb-2">오늘의 퀴즈를 준비하고 있어요...</div>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      ) : todayQuizzes.length > 0 && currentQuestionIndex < todayQuizzes.length ? (
        <div className="bg-white rounded-2xl p-3 shadow-lg flex-1">
          
          {/* 문제 표시 */}
          <div className="text-center mb-3 mt-8">
            <div className="flex justify-center gap-2 mb-2">
              <div className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-1 rounded-full text-xs">
                {todayQuizzes[currentQuestionIndex].category}
              </div>
              <div className={`inline-block text-white px-2 py-1 rounded-full text-xs ${
                todayQuizzes[currentQuestionIndex].difficulty === 'E' ? 'bg-green-500' :
                todayQuizzes[currentQuestionIndex].difficulty === 'M' ? 'bg-yellow-600' : 'bg-red-500'
              }`}>
                {getDifficultyLabel(todayQuizzes[currentQuestionIndex].difficulty)}
              </div>
            </div>
            <div className="text-lg font-bold text-gray-800 leading-relaxed px-2 mb-3">
              {todayQuizzes[currentQuestionIndex].question}
            </div>
          </div>

          {/* 선택지 */}
          <div className="grid grid-cols-1 gap-2">
            {todayQuizzes[currentQuestionIndex].options.map((option, index) => {
              let buttonClass = "p-3 rounded-xl text-center font-medium transition-all duration-200 border-2 ";
              
              if (showResult) {
                if (option.isCorrect) {
                  buttonClass += "bg-green-100 border-green-300 text-green-800 ";
                } else if (selectedAnswer?.text === option.text) {
                  buttonClass += "bg-red-100 border-red-300 text-red-800 ";
                } else {
                  buttonClass += "bg-gray-50 border-gray-200 text-gray-500 ";
                }
              } else {
                buttonClass += "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex flex-col items-center justify-center min-h-[45px] md:min-h-[55px]">
                    <span className="text-sm text-center font-semibold">{option.text}</span>
                    {showResult && option.isCorrect && (
                      <span className="text-green-600 font-bold text-xl mt-2">✓</span>
                    )}
                    {showResult && selectedAnswer?.text === option.text && !option.isCorrect && (
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
                selectedAnswer?.isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer?.isCorrect ? (
                  <div>
                    <div className="text-sm font-bold">🎉 정답!</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold mb-0.5">❌ 틀렸습니다</div>
                  </div>
                )}
              </div>
              
              {/* 정답/오답 상관없이 팁과 예시 표시 */}
              {todayQuizzes[currentQuestionIndex].tip && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded mx-2 mt-3 whitespace-pre-line text-left">
                  💡 {todayQuizzes[currentQuestionIndex].tip.replace(/(\s예:)/g, '\n예:')}
                </div>
              )}
              
              {gameOver ? (
                <div className="space-y-1.5">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 mb-2">🎊 퀴즈 완료! 정답률: {Math.round((score/5)*100)}%</div>
                    <div className="text-xs text-gray-500">
                      {score >= 5 ? '완벽해요! 🏆' : 
                       score >= 4 ? '훌륭해요! 👏' : 
                       score >= 3 ? '좋아요! 👍' : '계속 공부해보세요! 📚'}
                    </div>
                  </div>
                  <button
                    onClick={resetGame}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto text-sm"
                  >
                    <Trophy size={16} />
                    내일 다시 도전~!
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={nextQuestion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto text-sm"
                  >
                    다음 문제
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-lg font-medium mb-2">오늘의 퀴즈를 불러올 수 없습니다</div>
            <div className="text-sm">잠시 후 다시 시도해주세요.</div>
          </div>
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

export default InvestmentQuiz;