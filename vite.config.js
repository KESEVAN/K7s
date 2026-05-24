import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:              resolve(__dirname, 'index.html'),
        goals:             resolve(__dirname, 'goals.html'),
        works:             resolve(__dirname, 'works.html'),
        'tol-index':       resolve(__dirname, 'thinking_out_loud/index.html'),
        'tol-strings':     resolve(__dirname, 'thinking_out_loud/fdz-strings-and-silence.html'),
      }
    }
  }
})
