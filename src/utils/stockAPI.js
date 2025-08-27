// 주식 데이터 가져오기 유틸리티 - 무료 API 활용

// 무료 API 키들 (실제 사용 시 본인 키로 교체)
const API_KEYS = {
  FINNHUB: 'sandbox_c9k7rqiad3i9l9qhqd90', // 무료: 분당 60회
  ALPHA_VANTAGE: 'demo', // 무료: 하루 25회 (demo는 테스트용)
  POLYGON: 'demo', // 무료: 하루 5회
  TWELVE_DATA: 'demo' // 무료: 하루 800회
};

// API 엔드포인트
const API_ENDPOINTS = {
  FINNHUB: 'https://finnhub.io/api/v1/quote',
  TWELVE_DATA: 'https://api.twelvedata.com/quote',
  YAHOO_QUERY: 'https://query1.finance.yahoo.com/v8/finance/chart',
  FMP: 'https://financialmodelingprep.com/api/v3/quote'
};

// 메인 주식 데이터 가져오기 함수 - 무료 API 활용
export const fetchStockData = async (ticker) => {
  console.log(`${ticker} 주식 데이터 조회 시작 - 무료 API 활용`);
  
  // 1순위: Finnhub (가장 안정적인 무료 API)
  try {
    const result = await fetchFromFinnhub(ticker);
    if (result && result.currentPrice > 0) {
      console.log('Finnhub 성공:', result);
      return result;
    }
  } catch (error) {
    console.warn('Finnhub 실패:', error.message);
  }
  
  // 2순위: Yahoo Finance Query API (공식적이지 않지만 안정적)
  try {
    const result = await fetchFromYahooQuery(ticker);
    if (result && result.currentPrice > 0) {
      console.log('Yahoo Query 성공:', result);
      return result;
    }
  } catch (error) {
    console.warn('Yahoo Query 실패:', error.message);
  }
  
  // 3순위: Twelve Data
  try {
    const result = await fetchFromTwelveData(ticker);
    if (result && result.currentPrice > 0) {
      console.log('Twelve Data 성공:', result);
      return result;
    }
  } catch (error) {
    console.warn('Twelve Data 실패:', error.message);
  }
  
  // 모든 API 실패 시 시뮬레이션 데이터
  console.log('모든 API 실패, 시뮬레이션 데이터 사용');
  return generateSimulatedData(ticker);
};

// ChoiceStock.co.kr 스크래핑 (더 이상 사용하지 않음)
const fetchFromChoiceStock_deprecated = async (ticker) => {
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/'
  ];
  
  const url = `https://www.choicestock.co.kr/search/summary/${ticker.toUpperCase()}`;
  
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`ChoiceStock 시도 - 프록시: ${proxy.substring(0, 30)}...`);
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      if (!response.ok) {
        console.log(`프록시 응답 실패: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      console.log(`HTML 수신 완료 - 길이: ${html.length}`);
      
      const stockData = parseChoiceStockData(html, ticker);
      
      if (stockData && stockData.currentPrice) {
        console.log('ChoiceStock 데이터 파싱 성공:', stockData);
        return {
          ticker: ticker.toUpperCase(),
          name: stockData.name || getCompanyName(ticker) || `${ticker.toUpperCase()} Inc.`,
          currentPrice: stockData.currentPrice,
          previousClose: stockData.previousClose || stockData.currentPrice,
          currency: 'USD',
          marketState: 'CLOSED',
          source: 'choicestock'
        };
      }
    } catch (error) {
      console.error(`ChoiceStock 프록시 ${proxy} 오류:`, error);
      continue;
    }
  }
  
  throw new Error('ChoiceStock에서 데이터를 가져올 수 없습니다');
};

// ChoiceStock HTML 파싱
const parseChoiceStockData = (html, ticker) => {
  try {
    console.log('ChoiceStock HTML 파싱 시작');
    
    // 여러 방법으로 가격 정보 추출 시도
    
    // 방법 1: 숫자.숫자 USD 패턴 찾기 (더 정교한 패턴)
    const patterns = [
      /(\d+\.?\d*)\s*USD/gi,                    // 229.31 USD
      /USD\s*(\d+\.?\d*)/gi,                    // USD 229.31
      /"price"[^:]*:\s*(\d+\.?\d*)/gi,         // "price": 229.31
      /현재가[^0-9]*(\d+\.?\d*)/gi,             // 현재가: 229.31
      /Current[^0-9]*(\d+\.?\d*)/gi             // Current Price: 229.31
    ];
    
    let currentPrice = null;
    let previousClose = null;
    
    // 현재가 찾기
    for (const pattern of patterns) {
      const matches = [...html.matchAll(pattern)];
      console.log(`패턴 ${pattern} 매치:`, matches.map(m => m[1]));
      
      if (matches.length > 0) {
        currentPrice = parseFloat(matches[0][1]);
        console.log('현재가 발견:', currentPrice);
        break;
      }
    }
    
    if (currentPrice) {
      // 변화량에서 전일 종가 계산
      const changePatterns = [
        /([+-]\d+\.?\d*)\s*\([+-]?\d+\.?\d*%\)/g,     // +2.15 (+0.95%)
        /변화[^0-9]*([+-]\d+\.?\d*)/gi,                // 변화: +2.15
        /Change[^0-9]*([+-]\d+\.?\d*)/gi               // Change: +2.15
      ];
      
      for (const changePattern of changePatterns) {
        const changeMatches = [...html.matchAll(changePattern)];
        console.log(`변화량 패턴 ${changePattern} 매치:`, changeMatches.map(m => m[1]));
        
        if (changeMatches.length > 0) {
          const change = parseFloat(changeMatches[0][1]);
          previousClose = Math.round((currentPrice - change) * 100) / 100;
          console.log('전일 종가 계산:', previousClose);
          break;
        }
      }
      
      // 전일 종가를 찾지 못한 경우 현재가 사용
      if (!previousClose) {
        previousClose = currentPrice;
      }
      
      // 회사명 추출
      let companyName = getCompanyName(ticker);
      const titlePattern = /<title[^>]*>([^<]*)/i;
      const titleMatch = html.match(titlePattern);
      
      if (titleMatch) {
        const title = titleMatch[1];
        console.log('타이틀 발견:', title);
        if (title.includes(ticker.toUpperCase())) {
          const parts = title.split(/[-|]/);
          if (parts.length > 0) {
            companyName = parts[0].trim() || companyName;
          }
        }
      }
      
      console.log('파싱 완료:', { name: companyName, currentPrice, previousClose });
      
      return {
        name: companyName,
        currentPrice: currentPrice,
        previousClose: previousClose
      };
    }
    
    // 방법 4: JavaScript 데이터 추출
    const jsDataPattern = /price["\']?\s*:\s*["\']?(\d+\.\d+)["\']?/gi;
    const jsMatches = [...html.matchAll(jsDataPattern)];
    console.log('JS 데이터 매치:', jsMatches.map(m => m[1]));
    
    if (jsMatches.length > 0) {
      return {
        name: getCompanyName(ticker),
        currentPrice: parseFloat(jsMatches[0][1]),
        previousClose: parseFloat(jsMatches[0][1])
      };
    }
    
    console.log('ChoiceStock 파싱 실패 - 패턴 매치 없음');
    return null;
    
  } catch (error) {
    console.error('ChoiceStock 파싱 오류:', error);
    return null;
  }
};

// Yahoo Finance 스크래핑
const fetchFromYahooFinance = async (ticker) => {
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/'
  ];
  
  const url = `https://finance.yahoo.com/quote/${ticker.toUpperCase()}`;
  
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`Yahoo Finance 시도 - 프록시: ${proxy}`);
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) continue;
      
      const html = await response.text();
      const stockData = parseStockDataFromHTML(html);
      
      if (stockData && stockData.regularMarketPrice) {
        return {
          ticker: ticker.toUpperCase(),
          name: stockData.longName || stockData.shortName || `${ticker.toUpperCase()} Corp.`,
          currentPrice: stockData.regularMarketPrice?.raw || stockData.regularMarketPrice,
          previousClose: stockData.regularMarketPreviousClose?.raw || stockData.regularMarketPreviousClose,
          currency: stockData.currency || 'USD',
          marketState: stockData.marketState || 'CLOSED',
          source: 'yahoo_finance'
        };
      }
    } catch (error) {
      console.error(`프록시 ${proxy} 오류:`, error);
      continue;
    }
  }
  
  throw new Error('Yahoo Finance에서 데이터를 가져올 수 없습니다');
};

// Alpha Vantage API (더 이상 사용하지 않음 - demo 키로는 실제 데이터 불가)
const fetchFromAlphaVantage_deprecated = async (ticker) => {
  // demo 키로는 실제 데이터를 가져올 수 없음
  throw new Error('Alpha Vantage demo 키는 실제 데이터 미제공');
};

// Finnhub API (무료 제한: 분당 60회)
const fetchFromFinnhub = async (ticker) => {
  try {
    const url = `${API_ENDPOINTS.FINNHUB}?symbol=${ticker.toUpperCase()}&token=${API_KEYS.FINNHUB}`;
    console.log('Finnhub 요청:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Finnhub 응답:', data);
    
    // Finnhub 응답 형식: { c: current, pc: previous close, o: open, h: high, l: low }
    if (data && data.c && data.pc && data.c > 0) {
      return {
        ticker: ticker.toUpperCase(),
        name: getCompanyName(ticker) || `${ticker.toUpperCase()} Inc.`,
        currentPrice: parseFloat(data.c.toFixed(2)),
        previousClose: parseFloat(data.pc.toFixed(2)),
        currency: 'USD',
        marketState: 'CLOSED',
        source: 'finnhub'
      };
    }
    
    throw new Error('유효하지 않은 Finnhub 데이터');
  } catch (error) {
    throw new Error(`Finnhub API 오류: ${error.message}`);
  }
};

// Yahoo Finance Query API (CORS 제한 없음)
const fetchFromYahooQuery = async (ticker) => {
  try {
    const url = `${API_ENDPOINTS.YAHOO_QUERY}/${ticker.toUpperCase()}?region=US&lang=en-US&includePrePost=false&interval=1d&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`;
    console.log('Yahoo Query 요청:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Yahoo Query 응답:', data);
    
    const result = data.chart?.result?.[0];
    if (result && result.meta) {
      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      
      if (currentPrice > 0) {
        return {
          ticker: ticker.toUpperCase(),
          name: meta.longName || meta.shortName || getCompanyName(ticker) || `${ticker.toUpperCase()} Inc.`,
          currentPrice: parseFloat(currentPrice.toFixed(2)),
          previousClose: parseFloat(previousClose.toFixed(2)),
          currency: meta.currency || 'USD',
          marketState: meta.marketState || 'CLOSED',
          source: 'yahoo_query'
        };
      }
    }
    
    throw new Error('유효하지 않은 Yahoo 데이터');
  } catch (error) {
    throw new Error(`Yahoo Query API 오류: ${error.message}`);
  }
};

// Twelve Data API (무료 제한: 하루 800회)
const fetchFromTwelveData = async (ticker) => {
  try {
    const url = `${API_ENDPOINTS.TWELVE_DATA}?symbol=${ticker.toUpperCase()}&apikey=${API_KEYS.TWELVE_DATA}`;
    console.log('Twelve Data 요청:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Twelve Data 응답:', data);
    
    if (data && data.close && data.previous_close) {
      return {
        ticker: ticker.toUpperCase(),
        name: data.name || getCompanyName(ticker) || `${ticker.toUpperCase()} Inc.`,
        currentPrice: parseFloat(parseFloat(data.close).toFixed(2)),
        previousClose: parseFloat(parseFloat(data.previous_close).toFixed(2)),
        currency: 'USD',
        marketState: 'CLOSED',
        source: 'twelve_data'
      };
    }
    
    throw new Error('유효하지 않은 Twelve Data');
  } catch (error) {
    throw new Error(`Twelve Data API 오류: ${error.message}`);
  }
};

// 시뮬레이션 데이터 생성 (폴백)
const generateSimulatedData = (ticker) => {
  // 주식별로 일관된 가격 생성 (ticker를 seed로 사용)
  const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const basePrice = 50 + (random() * 400); // 50-450 범위
  const previousClose = Math.round(basePrice * 100) / 100;
  const currentPrice = Math.round((previousClose + (random() - 0.5) * 10) * 100) / 100;
  
  console.log(`${ticker} 시뮬레이션 데이터: 전일종가 ${previousClose}, 현재가 ${currentPrice}`);
  
  return {
    ticker: ticker.toUpperCase(),
    name: getCompanyName(ticker) || `${ticker.toUpperCase()} Corporation`,
    currentPrice,
    previousClose,
    currency: 'USD',
    marketState: 'SIMULATION',
    source: 'simulation'
  };
};

// 주요 기업 이름 매핑
const getCompanyName = (ticker) => {
  const companies = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
    'AMD': 'Advanced Micro Devices Inc.',
    'INTC': 'Intel Corporation'
  };
  return companies[ticker.toUpperCase()];
};

// HTML에서 주식 데이터 파싱
const parseStockDataFromHTML = (html) => {
  try {
    console.log('파싱 시작 - HTML 길이:', html.length);
    
    // 여러 패턴으로 데이터 추출 시도
    const patterns = [
      /root\.App\.main\s*=\s*({.*?});/s,
      /"QuoteSummaryStore":\s*({[^}]+})/s,
      /window\.__PRELOADED_STATE__\s*=\s*({.*?});/s,
      /"price":\s*({[^}]+})/s
    ];
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        console.log('매치된 패턴:', pattern);
        try {
          const jsonData = JSON.parse(match[1]);
          console.log('파싱된 JSON 데이터:', jsonData);
          
          // 다양한 경로로 데이터 접근 시도
          let stockData = null;
          
          // 첫 번째: QuoteSummaryStore 경로
          if (jsonData?.context?.dispatcher?.stores?.QuoteSummaryStore) {
            stockData = jsonData.context.dispatcher.stores.QuoteSummaryStore.price;
          }
          // 두 번째: 직접 price 객체
          else if (jsonData.regularMarketPrice) {
            stockData = jsonData;
          }
          // 세 번째: 중첩된 구조 탐색
          else if (jsonData.price) {
            stockData = jsonData.price;
          }
          
          if (stockData) {
            console.log('추출된 주식 데이터:', stockData);
            return {
              longName: stockData.longName,
              shortName: stockData.shortName,
              regularMarketPrice: stockData.regularMarketPrice,
              regularMarketPreviousClose: stockData.regularMarketPreviousClose,
              currency: stockData.currency,
              marketState: stockData.marketState
            };
          }
        } catch (parseError) {
          console.error('JSON 파싱 실패:', parseError);
          continue;
        }
      }
    }
    
    // 마지막 시도: HTML 텍스트에서 직접 가격 정보 추출
    console.log('JSON 파싱 실패, HTML 텍스트에서 직접 추출 시도');
    
    // 가격 정보를 포함한 span 태그들 찾기
    const priceRegex = /data-symbol="([^"]+)"[^>]*>([0-9,]+\.?[0-9]*)/g;
    const priceMatches = [...html.matchAll(priceRegex)];
    console.log('가격 매치:', priceMatches);
    
    return null;
  } catch (error) {
    console.error('HTML 파싱 오류:', error);
    return null;
  }
};

// 폴백 함수 (다른 프록시나 방법 시도)
const fetchStockDataFallback = async (ticker) => {
  // 다른 CORS 프록시들 순차적으로 시도
  for (let i = 1; i < CORS_PROXIES.length; i++) {
    try {
      const url = `${YAHOO_FINANCE_URL}${ticker.toUpperCase()}`;
      const response = await fetch(`${CORS_PROXIES[i]}${url}`);
      
      if (response.ok) {
        const html = await response.text();
        const stockData = parseStockDataFromHTML(html);
        
        if (stockData) {
          return {
            ticker: ticker.toUpperCase(),
            name: stockData.longName || stockData.shortName || `${ticker.toUpperCase()} Corp.`,
            currentPrice: stockData.regularMarketPrice?.raw || 0,
            previousClose: stockData.regularMarketPreviousClose?.raw || 0,
            currency: stockData.currency || 'USD',
            marketState: stockData.marketState || 'CLOSED'
          };
        }
      }
    } catch (error) {
      console.error(`프록시 ${i} 실패:`, error);
      continue;
    }
  }
  
  // 모든 방법 실패 시 모의 데이터 반환 (개발/테스트용)
  return {
    ticker: ticker.toUpperCase(),
    name: `${ticker.toUpperCase()} Corporation`,
    currentPrice: Math.round((Math.random() * 500 + 50) * 100) / 100,
    previousClose: Math.round((Math.random() * 500 + 50) * 100) / 100,
    currency: 'USD',
    marketState: 'CLOSED'
  };
};

// 여러 종목 동시 조회
export const fetchMultipleStocks = async (tickers) => {
  const promises = tickers.map(ticker => fetchStockData(ticker));
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`${tickers[index]} 조회 실패:`, result.reason);
      return {
        ticker: tickers[index].toUpperCase(),
        name: `${tickers[index].toUpperCase()} Corp.`,
        currentPrice: 0,
        previousClose: 0,
        currency: 'USD',
        marketState: 'ERROR',
        error: result.reason.message
      };
    }
  });
};

// 종목 유효성 검사
export const validateTicker = (ticker) => {
  // 기본적인 티커 형식 검사
  const tickerRegex = /^[A-Z]{1,5}$/;
  return tickerRegex.test(ticker.toUpperCase());
};