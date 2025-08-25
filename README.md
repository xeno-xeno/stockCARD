# Stock Ticker Quiz 🎯

미국 주식의 티커(Ticker Symbol)를 보고 올바른 회사명을 맞추는 퀴즈 게임입니다.

## 🎮 Live Demo

GitHub Pages에서 바로 플레이하세요: [Stock Ticker Quiz](https://xeno-xeno.github.io/stockCARD/)

## 🚀 시작하기

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/xenoxeno/StockCARD.git
   cd StockCARD
   ```

2. **패키지 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

## 📦 배포

### GitHub Pages 자동 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

1. `main` 브랜치에 푸시하면 자동으로 빌드 및 배포
2. GitHub Pages에서 확인 가능

### 수동 배포

```bash
npm run build
npm run preview
```

## ✨ 기능

- ✅ 티커 → 회사명 매칭 퀴즈
- ✅ 3개 선택지 중 정답 고르기
- ✅ 실시간 점수 및 통계 표시
- ✅ 연속 정답 스트릭 시스템
- ✅ 섹터별 분류 정보
- ✅ 반응형 디자인 (모바일 대응)

## 🎯 게임 방법

1. 화면에 표시되는 주식 티커(예: AAPL)를 확인
2. 3개의 회사명 중 올바른 답을 선택
3. 연속으로 맞춰서 최고 스트릭 달성
4. 팀원들과 점수 경쟁!

## 🏗️ 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘
- **GitHub Pages** - 호스팅

## 🔧 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # 코드 린팅
```

## 📊 주식 데이터

현재 20개의 대표적인 미국 주식을 포함:
- 기술주: Apple, Microsoft, Google, Meta, NVIDIA 등
- 미디어: Netflix, Disney, Spotify 등
- 핀테크: PayPal, Square 등
- 기타: Tesla, Amazon, Uber 등

## 🤝 기여하기

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 라이센스

MIT License
