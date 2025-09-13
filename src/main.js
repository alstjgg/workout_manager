import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'

// Import global styles
import './assets/css/main.css'

console.log('🏋️‍♀️ Initializing Workout Manager App...')

// ============ PINIA SETUP ============
const pinia = createPinia()

// ============ APP CREATION ============
try {
  const app = createApp(App)
  
  // Use plugins
  app.use(pinia)
  app.use(router)
  
  // Global error handler
  app.config.errorHandler = (err, vm, info) => {
    console.error('❌ Vue Error:', err, info)
  }
  
  // Mount app
  app.mount('#app')
  
  console.log('✅ Workout Manager App mounted successfully!')
  
} catch (error) {
  console.error('❌ App initialization failed:', error)
}