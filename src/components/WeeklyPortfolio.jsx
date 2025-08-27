import React, { useState, useEffect } from 'react';
import { Target, X, Calendar, TrendingUp, Plus, AlertCircle } from 'lucide-react';
import { fetchStockData, validateTicker } from '../utils/stockAPI';

const WeeklyPortfolio = ({ onGameEnd }) => {
  const [tickerInput, setTickerInput] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState('');
  const [portfolioSaved, setPortfolioSaved] = useState(false);
  const [finalReturns, setFinalReturns] = useState(null);
  const [error, setError] = useState('');

  // 현재 주차 정보 계산
  useEffect(() => {
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
    
    setCurrentWeek(`${formatDate(monday)}~${formatDate(friday)}`);
  }, []);

  // localStorage에서 기존 포트폴리오 확인
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('weeklyPortfolio');
    if (savedPortfolio) {
      const portfolio = JSON.parse(savedPortfolio);
      setSelectedStocks(portfolio.stocks || []);
      setPortfolioSaved(true);
    }
  }, []);

  // 에러 메시지 표시 및 자동 숨김
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  // 종목 추가
  const addStock = async () => {
    if (!tickerInput.trim() || selectedStocks.length >= 6) return;
    
    const ticker = tickerInput.toUpperCase().trim();
    
    // 티커 형식 검사
    if (!validateTicker(ticker)) {
      showError('올바른 티커 형식이 아닙니다 (1-5자 영문)');
      return;
    }
    
    // 중복 체크
    if (selectedStocks.some(stock => stock.ticker === ticker)) {
      showError('이미 추가된 종목입니다.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const stockData = await fetchStockData(ticker);
      
      const newStock = {
        ticker: stockData.ticker,
        name: stockData.name,
        selectedPrice: stockData.previousClose || stockData.currentPrice, // 전일 종가 우선 사용
        currentPrice: stockData.currentPrice,
        currency: stockData.currency,
        addedAt: new Date().toISOString()
      };
      
      setSelectedStocks(prev => [...prev, newStock]);
      setTickerInput('');
      
    } catch (error) {
      console.error('종목 추가 오류:', error);
      showError(error.message || '주가 정보를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 종목 삭제
  const removeStock = (ticker) => {
    setSelectedStocks(prev => prev.filter(stock => stock.ticker !== ticker));
  };

  // 포트폴리오 저장
  const savePortfolio = () => {
    const portfolio = {
      week: currentWeek,
      stocks: selectedStocks,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('weeklyPortfolio', JSON.stringify(portfolio));
    setPortfolioSaved(true);
    alert('포트폴리오가 저장되었습니다!');
  };

  // 최종 수익률 계산
  const calculateReturns = async () => {
    setIsLoading(true);
    setError('');
    const returns = [];
    
    try {
      for (const stock of selectedStocks) {
        try {
          const currentStockData = await fetchStockData(stock.ticker);
          const currentPrice = currentStockData.currentPrice || currentStockData.previousClose;
          const returnRate = ((currentPrice - stock.selectedPrice) / stock.selectedPrice * 100);
          
          returns.push({
            ...stock,
            currentPrice: currentPrice,
            returnRate: parseFloat(returnRate.toFixed(2))
          });
        } catch (error) {
          console.error(`${stock.ticker} 수익률 계산 오류:`, error);
          // 오류 발생 시 0% 수익률로 처리
          returns.push({
            ...stock,
            currentPrice: stock.selectedPrice,
            returnRate: 0,
            error: true
          });
        }
      }
      
      const averageReturn = (returns.reduce((sum, stock) => sum + stock.returnRate, 0) / returns.length);
      setFinalReturns({ 
        stocks: returns, 
        average: parseFloat(averageReturn.toFixed(2)) 
      });
      
    } catch (error) {
      console.error('수익률 계산 오류:', error);
      showError('수익률을 계산할 수 없습니다. 네트워크를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
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
            onClick={onGameEnd}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X size={12} />
            뒤로가기
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-2">
          <Calendar className="text-green-600" size={14} />
          <span className="text-sm font-semibold text-green-800">2025.{currentWeek}</span>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="bg-white rounded-2xl p-3 shadow-lg flex-1">
        
        {!finalReturns ? (
          <>
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="text-red-600" size={16} />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* 티커 입력 섹션 */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && addStock()}
                  placeholder="티커 입력 (예: AAPL, MSFT)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  disabled={isLoading || selectedStocks.length >= 6 || portfolioSaved}
                  maxLength={5}
                />
                <button
                  onClick={addStock}
                  disabled={isLoading || selectedStocks.length >= 6 || portfolioSaved || !tickerInput.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-1 text-sm"
                >
                  <Plus size={14} />
                  {isLoading ? '조회중...' : '추가'}
                </button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {selectedStocks.length}/6 종목 선택됨
              </div>
            </div>

            {/* 선택된 종목 카드 (2x3 그리드) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Array.from({ length: 6 }).map((_, index) => {
                const stock = selectedStocks[index];
                
                if (stock) {
                  return (
                    <div key={stock.ticker} className="border-2 border-green-200 rounded-xl p-3 bg-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm text-gray-800">{stock.ticker}</div>
                        {!portfolioSaved && (
                          <button
                            onClick={() => removeStock(stock.ticker)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-1 line-clamp-2">{stock.name}</div>
                      <div className="text-sm font-semibold text-green-600">
                        ${stock.selectedPrice?.toFixed(2)} {stock.currency}
                      </div>
                      <div className="text-xs text-gray-500">전일 종가</div>
                    </div>
                  );
                }
                
                return (
                  <div key={index} className="border-2 border-dashed border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-center min-h-[80px]">
                    <span className="text-xs text-gray-400">종목 {index + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* 완료 버튼 */}
            {selectedStocks.length === 6 && !portfolioSaved && (
              <button
                onClick={savePortfolio}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Target size={16} />
                포트폴리오 저장
              </button>
            )}

            {/* 수익률 계산 버튼 (저장된 포트폴리오가 있을 때) */}
            {portfolioSaved && (
              <button
                onClick={calculateReturns}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                <TrendingUp size={16} />
                {isLoading ? '계산 중...' : '최종 수익률 확인'}
              </button>
            )}
          </>
        ) : (
          /* 최종 결과 표시 */
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📊 최종 수익률
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {finalReturns.stocks.map((stock) => (
                <div key={stock.ticker} className="border-2 rounded-xl p-3 bg-white">
                  <div className="font-bold text-sm text-gray-800">{stock.ticker}</div>
                  <div className="text-xs text-gray-600 mb-1 line-clamp-2">{stock.name}</div>
                  <div className="text-xs text-gray-500">
                    ${stock.selectedPrice?.toFixed(2)} → ${stock.currentPrice?.toFixed(2)}
                  </div>
                  <div className={`text-sm font-bold ${
                    stock.error ? 'text-gray-500' : 
                    stock.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.error ? 'N/A' : 
                     `${stock.returnRate >= 0 ? '+' : ''}${stock.returnRate}%`}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
              <div className="text-sm text-gray-600">평균 수익률</div>
              <div className={`text-2xl font-bold ${
                finalReturns.average >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {finalReturns.average >= 0 ? '+' : ''}{finalReturns.average}%
              </div>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem('weeklyPortfolio');
                setSelectedStocks([]);
                setPortfolioSaved(false);
                setFinalReturns(null);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              새 포트폴리오 만들기
            </button>
          </div>
        )}
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

export default WeeklyPortfolio;