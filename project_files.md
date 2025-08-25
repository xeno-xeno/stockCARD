# Stock Ticker Quiz 프로젝트

Claude Code에서 이어서 작업할 수 있는 완전한 프로젝트 구조입니다.

## 프로젝트 구조
```
stock-ticker-quiz/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       └── StockTickerQuiz.jsx
└── README.md
```

## package.json
```json
{
  "name": "stock-ticker-quiz",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
```

## index.html
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>주식 티커 퀴즈</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## src/App.jsx
```jsx
import StockTickerQuiz from './components/StockTickerQuiz'

function App() {
  return (
    <div className="App">
      <StockTickerQuiz />
    </div>
  )
}

export default App
```

## src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

## src/components/StockTickerQuiz.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Shuffle, ChevronRight, Trophy, Target } from 'lucide-react';

const StockTickerQuiz = () => {
  // 주식 데이터 (더 많은 종목 추가)
  const stockData = [
    { ticker: 'AAPL', name: '애플', sector: '기술' },
    { ticker: 'MSFT', name: '마이크로소프트', sector: '기술' },
    { ticker: 'GOOGL', name: '구글', sector: '기술' },
    { ticker: 'AMZN', name: '아마존', sector: '소비재' },
    { ticker: 'TSLA', name: '테슬라', sector: '자동차' },
    { ticker: 'META', name: '메타', sector: '기술' },
    { ticker: 'NVDA', name: '엔비디아', sector: '반도체' },
    { ticker: 'NFLX', name: '넷플릭스', sector: '미디어' },
    { ticker: 'DIS', name: '디즈니', sector: '미디어' },
    { ticker: 'CRM', name: '세일즈포스', sector: '소프트웨어' },
    { ticker: 'PYPL', name: '페이팔', sector: '핀테크' },
    { ticker: 'INTC', name: '인텔', sector: '반도체' },
    { ticker: 'AMD', name: 'AMD', sector: '반도체' },
    { ticker: 'ORCL', name: '오라클', sector: '소프트웨어' },
    { ticker: 'IBM', name: 'IBM', sector: '기술' },
    { ticker: 'UBER', name: '우버', sector: '운송' },
    { ticker: 'SPOT', name: '스포티파이', sector: '미디어' },
    { ticker: 'ZOOM', name: '줌', sector: '소프트웨어' },
    { ticker: 'SQ', name: '스퀘어', sector: '핀테크' },
    { ticker: 'TWTR', name: '트위터', sector: '소셜미디어' }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // 새 문제 생성
  const generateQuestion = () => {
    const correct = stockData[Math.floor(Math.random() * stockData.length)];
    const incorrectOptions = stockData
      .filter(stock => stock.ticker !== correct.ticker)
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
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    generateQuestion();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setMaxStreak(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const getScorePercentage = () => {
    return totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(1) : 0;
  };

  // 시작 화면
  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="text-blue-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-800">주식 티커 퀴즈</h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            미국 주식의 티커(Ticker)를 보고<br />
            올바른 회사명을 맞춰보세요!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-700 mb-4">게임 방법</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• 티커(예: AAPL)가 주어집니다</li>
              <li>• 3개의 선택지 중 올바른 회사명을 고르세요</li>
              <li>• 연속 정답으로 콤보를 만들어보세요</li>
              <li>• {stockData.length}개의 다양한 종목이 출제됩니다</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Trophy size={24} />
            게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      
      {/* 헤더 & 점수 */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="text-blue-600" />
            주식 티커 퀴즈
          </h1>
          <button
            onClick={resetGame}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Shuffle size={16} />
            게임 종료
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">정답</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">{totalQuestions}</div>
            <div className="text-xs text-gray-500">총 문제</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{getScorePercentage()}%</div>
            <div className="text-xs text-gray-500">정답률</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-gray-500">연속정답</div>
          </div>
        </div>

        {maxStreak > 0 && (
          <div className="mt-3 text-center text-sm text-gray-600">
            최고 연속: <span className="font-semibold text-orange-600">{maxStreak}</span>
          </div>
        )}
      </div>

      {/* 문제 카드 */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          
          {/* 티커 표시 */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-xl mb-4">
              <div className="text-4xl font-mono font-bold">{currentQuestion.ticker}</div>
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.sector} 섹터
            </div>
            <p className="text-lg text-gray-700 mt-2">이 티커의 회사명은?</p>
          </div>

          {/* 선택지 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2 ";
              
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
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.name}</span>
                    {showResult && option.name === currentQuestion.correctAnswer && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                    {showResult && selectedAnswer?.name === option.name && option.name !== currentQuestion.correctAnswer && (
                      <span className="text-red-600 font-bold">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 결과 표시 */}
          {showResult && (
            <div className="mt-6 text-center">
              <div className={`p-4 rounded-lg mb-4 ${
                selectedAnswer?.name === currentQuestion.correctAnswer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer?.name === currentQuestion.correctAnswer ? (
                  <div>
                    <div className="text-xl font-bold mb-1">🎉 정답입니다!</div>
                    {streak > 1 && <div className="text-sm">🔥 {streak}연속 정답!</div>}
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold mb-1">❌ 틀렸습니다</div>
                    <div className="text-sm">정답: {currentQuestion.correctAnswer}</div>
                  </div>
                )}
              </div>
              
              <button
                onClick={nextQuestion}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                다음 문제
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 하단 안내 */}
      {!showResult && currentQuestion && (
        <div className="text-center mt-6 text-gray-600 text-sm">
          위 3개의 선택지 중 하나를 클릭하세요
        </div>
      )}
    </div>
  );
};

export default StockTickerQuiz;
```

## tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

## README.md
```markdown
# Stock Ticker Quiz 🎯

미국 주식의 티커(Ticker Symbol)를 보고 올바른 회사명을 맞추는 퀴즈 게임입니다.

## 시작하기

1. 프로젝트 디렉토리 생성
   ```bash
   mkdir stock-ticker-quiz
   cd stock-ticker-quiz
   ```

2. 패키지 설치
   ```bash
   npm install
   ```

3. 개발 서버 실행
   ```bash
   npm run dev
   ```

## 기능

- ✅ 티커 → 회사명 매칭 퀴즈
- ✅ 3개 선택지 중 정답 고르기
- ✅ 실시간 점수 및 통계 표시
- ✅ 연속 정답 스트릭 시스템
- ✅ 섹터별 분류 정보
- ✅ 반응형 디자인 (모바일 대응)

## 확장 가능한 기능들

- [ ] 더 많은 종목 데이터 추가 (현재 20개 → 수천개)
- [ ] 실시간 주가 API 연동
- [ ] 난이도별 모드 (초급/중급/고급)
- [ ] 섹터별 퀴즈 모드
- [ ] 랭킹 시스템
- [ ] 실제 로고 이미지 표시
- [ ] 주식 정보 상세 보기

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Lucide React (아이콘)

## 데이터 구조

각 주식 데이터는 다음 구조를 가집니다:
```javascript
{
  ticker: 'AAPL',      // 티커 심볼
  name: '애플',         // 한글 회사명
  sector: '기술'        // 업종
}
```
```

## 설치 및 실행 방법

1. **Claude Code에서 새 프로젝트 생성**:
   ```bash
   mkdir stock-ticker-quiz
   cd stock-ticker-quiz
   ```

2. **위의 파일들을 각각 생성**하고 내용을 복사하세요.

3. **패키지 설치**:
   ```bash
   npm install
   ```

4. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

## Claude Code 사용 팁

- `@claude create component` - 새 컴포넌트 생성
- `@claude add feature` - 기능 추가
- `@claude refactor` - 코드 리팩토링
- `@claude fix bug` - 버그 수정

모든 파일이 준비되었으니 Claude Code에서 바로 이어서 작업하실 수 있습니다! 🚀