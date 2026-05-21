import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/unearned-idle/',
  resolve: {
    alias: {
      '@data': resolve(__dirname, '../data'),
    },
  },
})
