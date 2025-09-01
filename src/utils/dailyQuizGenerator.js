// 일일 퀴즈 생성 시스템

// 퀴즈 생성 설정
const QUIZ_CONFIG = {
  daily_quiz_size: 5,
  category_quota: {
    "투자지표": 1,
    "차트/기술": 1,
    "시장상식": 2,
    "기본개념": 1,
    "배당": 0,
    "심리/매크로": 0
  },
  difficulty_quota: {
    "E": 2,
    "M": 2, 
    "H": 1
  },
  sampling_rules: {
    exclude_recent_days: 3,
    category_slack: 1,
    difficulty_strategy: "try-fill-category-first-then-difficulty",
    seed_strategy: "use-YYYYMMDD-as-seed-for-deterministic-daily-set"
  },
  display: {
    show_difficulty_badge: true,
    badge_labels: {"E": "기초", "M": "응용", "H": "실전"},
    order: "mixed"
  }
};

// 날짜 기반 시드 생성 (YYYYMMDD)
const getDateSeed = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`);
};

// 시드 기반 랜덤 생성기 (Linear Congruential Generator)
class SeededRandom {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// 최근 N일간 사용된 퀴즈 ID 가져오기
const getRecentQuizIds = (excludeDays) => {
  const recentIds = new Set();
  const today = new Date();
  
  for (let i = 1; i <= excludeDays; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const dateKey = `daily_quiz_${pastDate.getFullYear()}_${pastDate.getMonth() + 1}_${pastDate.getDate()}`;
    
    const storedQuiz = localStorage.getItem(dateKey);
    if (storedQuiz) {
      try {
        const quizIds = JSON.parse(storedQuiz);
        quizIds.forEach(id => recentIds.add(id));
      } catch (e) {
        console.warn('Failed to parse stored quiz:', e);
      }
    }
  }
  
  return recentIds;
};

// 카테고리별, 난이도별 퀴즈 분류
const categorizeQuizzes = (allQuizzes, excludeIds) => {
  const available = allQuizzes.filter(quiz => !excludeIds.has(quiz.id));
  
  const byCategory = {};
  const byDifficulty = {};
  
  available.forEach(quiz => {
    // 카테고리별 분류
    if (!byCategory[quiz.category]) {
      byCategory[quiz.category] = [];
    }
    byCategory[quiz.category].push(quiz);
    
    // 난이도별 분류
    if (!byDifficulty[quiz.difficulty]) {
      byDifficulty[quiz.difficulty] = [];
    }
    byDifficulty[quiz.difficulty].push(quiz);
  });
  
  return { byCategory, byDifficulty, available };
};

// 카테고리 우선 선택 전략
const selectQuizzesByCategory = (byCategory, categoryQuota, random) => {
  const selected = [];
  const usedIds = new Set();
  
  // 1단계: 각 카테고리별 할당량만큼 선택
  Object.entries(categoryQuota).forEach(([category, quota]) => {
    const categoryQuizzes = byCategory[category] || [];
    const availableQuizzes = categoryQuizzes.filter(q => !usedIds.has(q.id));
    const shuffledQuizzes = random.shuffle(availableQuizzes);
    
    const toSelect = Math.min(quota, shuffledQuizzes.length);
    for (let i = 0; i < toSelect; i++) {
      selected.push(shuffledQuizzes[i]);
      usedIds.add(shuffledQuizzes[i].id);
    }
  });
  
  return { selected, usedIds };
};

// 부족한 퀴즈를 난이도별로 보충
const fillRemainingByDifficulty = (byDifficulty, difficultyQuota, usedIds, targetSize, random) => {
  const additional = [];
  
  Object.entries(difficultyQuota).forEach(([difficulty, quota]) => {
    const difficultyQuizzes = byDifficulty[difficulty] || [];
    const availableQuizzes = difficultyQuizzes.filter(q => !usedIds.has(q.id));
    const shuffledQuizzes = random.shuffle(availableQuizzes);
    
    // 현재까지 선택된 해당 난이도 퀴즈 수 계산
    const currentCount = additional.filter(q => q.difficulty === difficulty).length;
    const needed = Math.max(0, quota - currentCount);
    const remaining = targetSize - additional.length - usedIds.size;
    const toSelect = Math.min(needed, shuffledQuizzes.length, remaining);
    
    for (let i = 0; i < toSelect; i++) {
      additional.push(shuffledQuizzes[i]);
      usedIds.add(shuffledQuizzes[i].id);
    }
  });
  
  return additional;
};

// 메인 일일 퀴즈 생성 함수
export const generateDailyQuiz = (allQuizzes, date = new Date()) => {
  const seed = getDateSeed(date);
  const random = new SeededRandom(seed);
  
  console.log(`일일 퀴즈 생성 시작 - 날짜: ${date.toISOString().split('T')[0]}, 시드: ${seed}`);
  
  // 최근 사용된 퀴즈 제외
  const excludeIds = getRecentQuizIds(QUIZ_CONFIG.sampling_rules.exclude_recent_days);
  console.log(`최근 ${QUIZ_CONFIG.sampling_rules.exclude_recent_days}일간 제외 퀴즈 수:`, excludeIds.size);
  
  // 퀴즈 분류
  const { byCategory, byDifficulty, available } = categorizeQuizzes(allQuizzes, excludeIds);
  console.log('카테고리별 사용 가능 퀴즈 수:', Object.keys(byCategory).map(cat => ({
    category: cat,
    count: byCategory[cat]?.length || 0
  })));
  
  // 카테고리별 선택
  const { selected, usedIds } = selectQuizzesByCategory(byCategory, QUIZ_CONFIG.category_quota, random);
  console.log(`카테고리별 선택 완료: ${selected.length}개`);
  
  // 부족한 만큼 난이도별로 보충
  if (selected.length < QUIZ_CONFIG.daily_quiz_size) {
    const additional = fillRemainingByDifficulty(
      byDifficulty, 
      QUIZ_CONFIG.difficulty_quota, 
      usedIds, 
      QUIZ_CONFIG.daily_quiz_size, 
      random
    );
    selected.push(...additional);
    console.log(`난이도별 보충 완료: ${additional.length}개 추가`);
  }
  
  // 부족하면 나머지를 랜덤으로 채움
  if (selected.length < QUIZ_CONFIG.daily_quiz_size) {
    const remaining = available.filter(q => !usedIds.has(q.id));
    const shuffledRemaining = random.shuffle(remaining);
    const needed = QUIZ_CONFIG.daily_quiz_size - selected.length;
    
    for (let i = 0; i < Math.min(needed, shuffledRemaining.length); i++) {
      selected.push(shuffledRemaining[i]);
    }
    console.log(`랜덤 보충 완료: 총 ${selected.length}개 퀴즈 선택`);
  }
  
  // 최종 순서 섞기
  const finalQuizzes = random.shuffle(selected.slice(0, QUIZ_CONFIG.daily_quiz_size));
  
  // 결과 통계
  const stats = {
    total: finalQuizzes.length,
    byCategory: {},
    byDifficulty: {}
  };
  
  finalQuizzes.forEach(quiz => {
    stats.byCategory[quiz.category] = (stats.byCategory[quiz.category] || 0) + 1;
    stats.byDifficulty[quiz.difficulty] = (stats.byDifficulty[quiz.difficulty] || 0) + 1;
  });
  
  console.log('최종 선택 통계:', stats);
  
  // 오늘의 퀴즈 ID를 localStorage에 저장
  const today = new Date(date);
  const dateKey = `daily_quiz_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  localStorage.setItem(dateKey, JSON.stringify(finalQuizzes.map(q => q.id)));
  
  return {
    quizzes: finalQuizzes,
    stats,
    date: date.toISOString().split('T')[0],
    seed
  };
};

// 오늘의 퀴즈 가져오기 (캐싱된 결과 사용)
export const getTodayQuiz = (allQuizzes) => {
  const today = new Date();
  const dateKey = `daily_quiz_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  const cached = localStorage.getItem(`${dateKey}_full`);
  
  if (cached) {
    try {
      const result = JSON.parse(cached);
      console.log('캐싱된 오늘의 퀴즈 로드:', result.stats);
      return result;
    } catch (e) {
      console.warn('캐시된 퀴즈 파싱 실패:', e);
    }
  }
  
  // 새로 생성
  const result = generateDailyQuiz(allQuizzes, today);
  localStorage.setItem(`${dateKey}_full`, JSON.stringify(result));
  
  return result;
};

// 난이도 라벨 가져오기
export const getDifficultyLabel = (difficulty) => {
  return QUIZ_CONFIG.display.badge_labels[difficulty] || difficulty;
};

// 설정 내보내기
export { QUIZ_CONFIG };