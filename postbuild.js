import fs from 'fs';
import path from 'path';

// dist 폴더의 assets 내 파일들 찾기
const assetsDir = './dist/assets';
const files = fs.readdirSync(assetsDir);

const jsFile = files.find(file => file.startsWith('main-') && file.endsWith('.js'));
const cssFile = files.find(file => file.startsWith('game-') && file.endsWith('.css'));

console.log('Found JS file:', jsFile);
console.log('Found CSS file:', cssFile);

// game 폴더 생성
if (!fs.existsSync('./dist/game')) {
  fs.mkdirSync('./dist/game');
}

// game.html을 기반으로 game/index.html 생성
let gameHtml = fs.readFileSync('./game.html', 'utf8');
gameHtml = gameHtml.replace('/src/main.jsx', `../assets/${jsFile}`);
gameHtml = gameHtml.replace('</head>', `  <link rel="stylesheet" href="../assets/${cssFile}">
</head>`);

fs.writeFileSync('./dist/game/index.html', gameHtml);

// GitHub Actions에서는 빌드된 index.html을 그대로 사용
// public/index.html 복사는 로컬 빌드에서만 필요함
if (!process.env.CI) {
  fs.copyFileSync('./public/index.html', './dist/index.html');
}

console.log('Post-build completed successfully!');