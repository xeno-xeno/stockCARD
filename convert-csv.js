import fs from 'fs';

const csvContent = fs.readFileSync('./quiz_pool_300_final_tip.csv', 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());
const header = lines[0].split(',');

const quizData = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // CSV 파싱 (콤마로 구분하되 따옴표 안의 콤마는 무시)
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^["']|["']$/g, '')); // 따옴표 제거
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim().replace(/^["']|["']$/g, '')); // 마지막 값도 따옴표 제거
  
  if (values.length >= 6) {
    // 새로운 구조: 카테고리,퀴즈,보기1,보기2,정답,힌트
    quizData.push({
      id: i, // 순서대로 id 부여
      category: values[0],
      difficulty: 'M', // 기본 중급으로 설정
      question: values[1],
      option1: values[2],
      option2: values[3],
      answer: parseInt(values[4]), // 정답은 1 또는 2
      tip: (values[5] || '').replace(/^["']?팁!\s*:\s*/, '').replace(/["']?$/, '')
    });
  }
}

console.log(`총 ${quizData.length}개의 퀴즈 데이터를 변환했습니다.`);

const jsContent = `export const investQuizData = ${JSON.stringify(quizData, null, 2)};`;

fs.writeFileSync('./src/data/investQuizData.jsx', jsContent);
console.log('invest quiz 데이터 파일이 생성되었습니다: src/data/investQuizData.jsx');