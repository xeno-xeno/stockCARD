import fs from 'fs';

const csvContent = fs.readFileSync('./invest_quiz_200.csv', 'utf8');
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
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim()); // 마지막 값 추가
  
  if (values.length >= 6) {
    quizData.push({
      id: parseInt(values[0]),
      category: values[1],
      question: values[2],
      option1: values[3],
      option2: values[4],
      answer: values[5],
      tip: (values[6] || '').replace(/^팁!\s*/, '')
    });
  }
}

console.log(`총 ${quizData.length}개의 퀴즈 데이터를 변환했습니다.`);

const jsContent = `export const investQuizData = ${JSON.stringify(quizData, null, 2)};`;

fs.writeFileSync('./src/data/investQuizData.jsx', jsContent);
console.log('invest quiz 데이터 파일이 생성되었습니다: src/data/investQuizData.jsx');