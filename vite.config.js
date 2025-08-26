import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'postbuild',
      closeBundle() {
        exec('node postbuild.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`postbuild error: ${error}`);
            return;
          }
          console.log(stdout);
        });
      }
    }
  ],
  base: '/stockCARD/',
  build: {
    rollupOptions: {
      input: {
        main: 'game.html',
        quiz: 'quiz.html',
      }
    }
  }
})