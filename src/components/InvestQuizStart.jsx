import { TrendingUp, Trophy } from 'lucide-react';

const InvestQuizStart = ({ onStartGame, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">매일 투자지식 한스푼</h1>
          </div>
          
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            하루 하나씩 투자 지식을 만나세요.<br />
            꾸준히 반복할 수록 투자는 성공합니다.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">학습 방법</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• 초급/응용/고급 단계의 다양한 투자지식이 제공됩니다.</li>
              <li>• 답변 후 자세한 정보를 확인할 수 있습니다.</li>
              <li>• '새로운 지식'으로 다른 투자지식을 만나보세요.</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onStartGame}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto w-full justify-center"
            >
              <Trophy size={20} />
              오늘의 투자지식 만나기
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