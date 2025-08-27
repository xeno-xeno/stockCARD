import { useState } from 'react';
import { TrendingUp, Calendar, Target, Trophy, ArrowLeft, User } from 'lucide-react';

const WeeklyPortfolioStart = ({ onStartGame, onBack }) => {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    // 닉네임을 localStorage에 저장
    localStorage.setItem('portfolioNickname', nickname.trim());
    onStartGame();
  };

  // 현재 주차 정보 계산
  const getCurrentWeek = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    
    const formatDate = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}.${day}`;
    };
    
    return `${formatDate(monday)}~${formatDate(friday)}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-2 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      
      {/* 헤더 */}
      <div className="bg-white rounded-2xl p-3 mb-2 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-1">
            <TrendingUp className="text-green-600" size={16} />
            주간 포트폴리오
          </h1>
          <button
            onClick={onBack}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ArrowLeft size={12} />
            홈으로
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-2">
          <Calendar className="text-green-600" size={14} />
          <span className="text-sm font-semibold text-green-800">2025.{getCurrentWeek()}</span>
        </div>
      </div>

      {/* 게임 소개 */}
      <div className="bg-white rounded-2xl p-4 shadow-lg flex-1">
        
        {/* 타이틀 */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl mb-4">
            <TrendingUp size={32} className="mx-auto mb-2" />
            <div className="text-xl font-bold">주간 포트폴리오 챌린지</div>
          </div>
        </div>

        {/* 게임 설명 */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
              <Target size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">6개 종목 선택</h3>
              <p className="text-sm text-gray-600">
                이번 주에 상승할 것 같은 미국 주식 6개를 선택하세요
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-600 rounded-full p-2 flex-shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">일주일 대기</h3>
              <p className="text-sm text-gray-600">
                선택한 종목들의 종가가 기록되고 다음 주까지 기다립니다
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 rounded-full p-2 flex-shrink-0">
              <Trophy size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">수익률 경쟁</h3>
              <p className="text-sm text-gray-600">
                다른 사용자들과 포트폴리오 수익률을 비교해보세요
              </p>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">📌 참고사항</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• 현재는 데모 버전으로 가상의 주가 데이터를 사용합니다</li>
            <li>• 포트폴리오는 브라우저 로컬에 저장됩니다</li>
            <li>• 티커 입력 시 대문자로 입력해주세요 (예: AAPL, MSFT)</li>
          </ul>
        </div>

        {/* 닉네임 입력 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-blue-600" size={16} />
            <span className="text-sm font-semibold text-gray-700">플레이어 정보</span>
          </div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="닉네임을 입력하세요 (리더보드에 표시됩니다)"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            maxLength={20}
          />
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <TrendingUp size={20} />
          포트폴리오 만들기 시작
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-auto py-2">
        <div className="text-xs text-gray-400">
          powered by 초이스스탁
        </div>
      </div>
    </div>
  );
};

export default WeeklyPortfolioStart;