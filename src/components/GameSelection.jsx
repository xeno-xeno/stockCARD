import { useEffect } from 'react';
import { Target, TrendingUp, BarChart3, Gamepad2 } from 'lucide-react';

const GameSelection = ({ onGameSelect }) => {
  // 브라우저 타이틀 설정
  useEffect(() => {
    document.title = 'StockGame - 즐거운 주식탐구생활 게임';
  }, []);
  const games = [
    {
      id: 'ticker100',
      title: '도전 티커 100!',
      description: '티커를 보고 회사명을 맞춰보세요',
      icon: Target,
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'hover:border-blue-300',
      difficulty: '초급~고급',
      status: '플레이 가능'
    },
    {
      id: 'invest-quiz',
      title: '매일투자퀴즈 5!',
      description: '가볍게 즐기는 5문항 투자 퀴즈',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'hover:border-green-300',
      difficulty: '초급~중급',
      status: '플레이 가능'
    },
    {
      id: 'weekly-portfolio',
      title: '주간 포트폴리오',
      description: '6개 종목으로 일주일 수익률 경쟁',
      icon: BarChart3,
      iconColor: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'hover:border-purple-300',
      difficulty: '중급',
      status: '개발중'
    },
    {
      id: 'coming-soon-3',
      title: '??? ???????',
      description: '실전 같은 투자 경험을 제공하는 게임',
      icon: Gamepad2,
      iconColor: 'text-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'hover:border-orange-300',
      difficulty: '???',
      status: '준비중'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col">
      
      {/* 헤더 */}
      <div className="text-center mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📈 StockGame</h1>
        <p className="text-lg text-gray-600">즐거운 주식탐구생활 게임</p>
      </div>

      {/* 게임 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {games.map((game) => {
          const IconComponent = game.icon;
          const isAvailable = game.status === '플레이 가능';
          
          return (
            <div
              key={game.id}
              onClick={() => isAvailable && onGameSelect(game.id)}
              className={`
                bg-gradient-to-r ${game.bgColor} 
                border-2 border-transparent ${isAvailable ? game.borderColor : 'border-gray-200'} 
                rounded-2xl p-6 shadow-lg transition-all duration-200 
                ${isAvailable 
                  ? 'hover:shadow-xl cursor-pointer transform hover:-translate-y-1' 
                  : 'opacity-60 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm ${isAvailable ? '' : 'grayscale'}`}>
                  <IconComponent className={`${game.iconColor} ${isAvailable ? '' : 'text-gray-400'}`} size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{game.title}</h3>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }
                    `}>
                      {game.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      난이도: {game.difficulty}
                    </span>
                    
                    {isAvailable && (
                      <div className="text-blue-600 text-sm font-medium">
                        플레이하기 →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-auto py-4">
        <div className="text-xs text-gray-400">
          powered by 초이스스탁
        </div>
      </div>
    </div>
  );
};

export default GameSelection;