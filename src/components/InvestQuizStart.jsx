import { TrendingUp, Trophy } from 'lucide-react';

const InvestQuizStart = ({ onStartGame, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">매일투자퀴즈 20!</h1>
          </div>
          
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            매일 퀴즈에 도전하세요.<br />
            듀오링고처럼 어느새 투자실력이 쑥~!
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">게임 방법</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• 투자 관련 퀴즈가 출제됩니다</li>
              <li>• 2개의 선택지 중 올바른 답을 고르세요</li>
              <li>• 총 20문제가 랜덤으로 출제됩니다</li>
              <li>• 힌트가 제공되어 학습에 도움이 됩니다</li>
              <li>• 정답률과 최고기록이 저장됩니다</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onStartGame}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto w-full justify-center"
            >
              <Trophy size={20} />
              퀴즈 시작하기
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

export default InvestQuizStart;