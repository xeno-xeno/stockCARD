import { Target, Trophy } from 'lucide-react';

const Ticker100Start = ({ onStartGame, onBack }) => {
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
          
          <div className="space-y-3">
            <button
              onClick={onStartGame}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto w-full justify-center"
            >
              <Trophy size={20} />
              게임 시작하기
            </button>
            
            <button
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors w-full"
            >
              ← 게임 목록으로 돌아가기
            </button>
          </div>
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
};

export default Ticker100Start;