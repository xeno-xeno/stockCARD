import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target } from 'lucide-react';
import { investQuizData } from '../data/investQuizData';
import { getDifficultyLabel, QUIZ_CONFIG } from '../utils/dailyQuizGenerator';

const InvestmentQuiz = ({ onGameEnd }) => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = '매일투자퀴즈 5! - StockGame';
    return () => {
      document.title = 'StockGame'; // 컴포넌트 언마운트 시 원래 타이틀로 복원
    };
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState(new Set());

  // 새 문제 생성 (난이도 균형 고려)
  const generateQuestion = () => {
    if (totalQuestions >= QUIZ_CONFIG.daily_quiz_size) {
      setGameOver(true);
      return;
    }

    // 아직 사용하지 않은 문제들 중에서 선택
    const availableQuestions = investQuizData.filter(quiz => !usedQuestions.has(quiz.id));
    
    if (availableQuestions.length === 0) {
      setGameOver(true);
      return;
    }

    // 현재까지 선택된 난이도별 개수 계산
    const currentDifficulties = Array.from(usedQuestions).map(id => {
      const quiz = investQuizData.find(q => q.id === id);
      return quiz ? quiz.difficulty : null;
    }).filter(d => d);

    const difficultyCount = {
      'E': currentDifficulties.filter(d => d === 'E').length,
      'M': currentDifficulties.filter(d => d === 'M').length,
      'H': currentDifficulties.filter(d => d === 'H').length
    };

    // 남은 문제 수에 따른 목표 난이도 결정
    const remaining = QUIZ_CONFIG.daily_quiz_size - totalQuestions;
    let targetDifficulty = null;

    // 난이도별 우선순위 결정 (초급 2~3개, 응용 1~2개, 고급 0~1개)
    if (difficultyCount['E'] < 2 || (difficultyCount['E'] < 3 && Math.random() > 0.5)) {
      targetDifficulty = 'E';
    } else if (difficultyCount['M'] < 2 && difficultyCount['E'] >= 2) {
      targetDifficulty = 'M';
    } else if (difficultyCount['H'] < 1 && difficultyCount['E'] >= 2 && difficultyCount['M'] >= 1 && Math.random() > 0.7) {
      targetDifficulty = 'H';
    }

    // 목표 난이도가 있으면 해당 난이도 문제 우선 선택
    let candidateQuestions = availableQuestions;
    if (targetDifficulty) {
      const targetQuestions = availableQuestions.filter(q => q.difficulty === targetDifficulty);
      if (targetQuestions.length > 0) {
        candidateQuestions = targetQuestions;
      }
    }

    const selectedQuiz = candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
    
    setCurrentQuestion({
      id: selectedQuiz.id,
      category: selectedQuiz.category,
      difficulty: selectedQuiz.difficulty,
      question: selectedQuiz.question,
      options: [
        { text: selectedQuiz.option1, isCorrect: selectedQuiz.answer === 1 },
        { text: selectedQuiz.option2, isCorrect: selectedQuiz.answer === 2 }
      ].sort(() => Math.random() - 0.5), // 순서 섞기
      correctAnswer: selectedQuiz.answer,
      tip: selectedQuiz.tip
    });
    
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (selectedOption) => {
    if (showResult) return;
    
    setSelectedAnswer(selectedOption);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    setUsedQuestions(prev => new Set([...prev, currentQuestion.id]));

    if (selectedOption.isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    setUsedQuestions(new Set());
    generateQuestion();
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setUsedQuestions(new Set());
  };

  // 게임 시작 시 첫 문제 생성
  useEffect(() => {
    if (gameStarted && !currentQuestion && !gameOver) {
      generateQuestion();
    }
  }, [gameStarted]);

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
            <div className="text-base font-bold text-gray-700">{totalQuestions}/{QUIZ_CONFIG.daily_quiz_size}</div>
            <div className="text-xs text-gray-500">진행도</div>
          </div>
          <div>
            <div className="text-base font-bold text-green-600">{totalQuestions > 0 ? Math.round((score/totalQuestions)*100) : 0}%</div>
            <div className="text-xs text-gray-500">정답률</div>
          </div>
        </div>
        
      </div>

      {/* 문제 카드 */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-3 shadow-lg flex-1">
          
          {/* 문제 표시 */}
          <div className="text-center mb-3 mt-8">
            <div className="flex justify-center gap-2 mb-2">
              <div className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-1 rounded-full text-xs">
                {currentQuestion.category}
              </div>
              <div className={`inline-block text-white px-2 py-1 rounded-full text-xs ${
                currentQuestion.difficulty === 'E' ? 'bg-green-500' :
                currentQuestion.difficulty === 'M' ? 'bg-yellow-600' : 'bg-red-500'
              }`}>
                {getDifficultyLabel(currentQuestion.difficulty)}
              </div>
            </div>
            <div className="text-lg font-bold text-gray-800 leading-relaxed px-2 mb-3">
              {currentQuestion.question}
            </div>
          </div>

          {/* 선택지 */}
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option, index) => {
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
              {currentQuestion.tip && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded mx-2 mt-3 whitespace-pre-line text-left">
                  💡 {currentQuestion.tip.replace(/(\s예:)/g, '\n예:')}
                </div>
              )}
              
              {gameOver ? (
                <div className="space-y-1.5">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">🎊 퀴즈 완료!</div>
                    <div className="text-lg font-bold text-green-600 mb-1">{score}/5 정답</div>
                    <div className="text-sm text-gray-600 mb-1">정답률: {Math.round((score/5)*100)}%</div>
                    <div className="text-xs text-gray-500">
                      {score >= 5 ? '완벽해요! 🏆' : 
                       score >= 4 ? '훌륭해요! 👏' : 
                       score >= 3 ? '좋아요! 👍' : '계속 공부해보세요! 📚'}
                    </div>
                  </div>
                  <button
                    onClick={onGameEnd}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto text-sm"
                  >
                    <Trophy size={16} />
                    다시 도전
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