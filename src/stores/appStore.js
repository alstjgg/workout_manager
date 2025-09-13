import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Loading states
  const isLoading = ref(false)
  const loadingMessage = ref('')
  
  // Error handling
  const errorMessage = ref('')
  const lastError = ref(null)
  
  // Network status
  const isOnline = ref(navigator.onLine)
  
  // App metadata
  const appVersion = ref('1.0.0')
  const lastSyncTime = ref(null)
  const syncStatus = ref('idle') // idle, syncing, success, error
  
  // Feature flags
  const features = ref({
    googleSheetsIntegration: false,
    claudeAiIntegration: false,
    offlineMode: true,
    pushNotifications: false,
    analyticsTracking: false
  })
  
  // Settings
  const settings = ref({
    theme: 'auto', // light, dark, auto
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      motivationalMessages: true
    },
    sync: {
      autoSync: true,
      syncInterval: 5, // minutes
      wifiOnly: false
    },
    privacy: {
      dataCollection: false,
      crashReporting: true
    }
  })
  
  // Computed properties
  const hasError = computed(() => errorMessage.value !== '')
  const canSync = computed(() => isOnline.value && features.value.googleSheetsIntegration)
  const shouldShowOfflineIndicator = computed(() => !isOnline.value)
  
  // Actions
  const setLoading = (loading, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
    console.log(loading ? `⏳ Loading: ${message}` : '✅ Loading complete')
  }
  
  const setError = (error, duration = 5000) => {
    if (typeof error === 'string') {
      errorMessage.value = error
      lastError.value = { message: error, timestamp: Date.now() }
    } else {
      errorMessage.value = error.message || 'An unexpected error occurred'
      lastError.value = { error, timestamp: Date.now() }
    }
    
    console.error('❌ App Error:', error)
    
    // Auto-clear error after duration
    if (duration > 0) {
      setTimeout(() => {
        clearError()
      }, duration)
    }
  }
  
  const clearError = () => {
    errorMessage.value = ''
  }
  
  const setOnlineStatus = (online) => {
    const wasOffline = !isOnline.value
    isOnline.value = online
    
    console.log(online ? '🌐 Back online' : '📴 Gone offline')
    
    if (online && wasOffline && settings.value.sync.autoSync) {
      // Trigger sync when coming back online
      console.log('🔄 Triggering sync after reconnection')
      // Could trigger sync here
    }
  }
  
  const enableFeature = (featureName) => {
    if (features.value.hasOwnProperty(featureName)) {
      features.value[featureName] = true
      saveSettings()
      console.log(`✅ Feature enabled: ${featureName}`)
    }
  }
  
  const disableFeature = (featureName) => {
    if (features.value.hasOwnProperty(featureName)) {
      features.value[featureName] = false
      saveSettings()
      console.log(`❌ Feature disabled: ${featureName}`)
    }
  }
  
  const updateSettings = (newSettings) => {
    settings.value = {
      ...settings.value,
      ...newSettings
    }
    saveSettings()
    console.log('⚙️ Settings updated')
  }
  
  const setSyncStatus = (status, timestamp = null) => {
    syncStatus.value = status
    if (timestamp || status === 'success') {
      lastSyncTime.value = timestamp || new Date().toISOString()
    }
    console.log(`🔄 Sync status: ${status}`)
  }
  
  // Persistence
  const saveSettings = () => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings.value))
      localStorage.setItem('appFeatures', JSON.stringify(features.value))
    } catch (error) {
      console.error('Error saving app settings:', error)
    }
  }
  
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('appSettings')
      if (savedSettings) {
        settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
      }
      
      const savedFeatures = localStorage.getItem('appFeatures')
      if (savedFeatures) {
        features.value = { ...features.value, ...JSON.parse(savedFeatures) }
      }
      
      const savedSyncTime = localStorage.getItem('lastSyncTime')
      if (savedSyncTime) {
        lastSyncTime.value = savedSyncTime
      }
      
      console.log('📱 Loaded app settings from localStorage')
    } catch (error) {
      console.error('Error loading app settings:', error)
    }
  }
  
  // App lifecycle
  const initializeApp = async () => {
    try {
      setLoading(true, 'Initializing app...')
      
      // Load saved settings
      loadSettings()
      
      // Check for updates
      await checkForUpdates()
      
      // Initialize features
      await initializeFeatures()
      
      setLoading(false)
      console.log('🚀 App initialized successfully')
      
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }
  
  const checkForUpdates = async () => {
    // Check for app updates or data migrations
    try {
      const currentVersion = localStorage.getItem('appVersion')
      if (currentVersion !== appVersion.value) {
        console.log(`📱 App updated from ${currentVersion} to ${appVersion.value}`)
        localStorage.setItem('appVersion', appVersion.value)
        // Could run migration logic here
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }
  
  const initializeFeatures = async () => {
    // Initialize enabled features
    if (features.value.googleSheetsIntegration) {
      console.log('🔗 Initializing Google Sheets integration')
      // Initialize Google Sheets connection
    }
    
    if (features.value.claudeAiIntegration) {
      console.log('🤖 Initializing Claude AI integration')
      // Initialize Claude AI connection
    }
    
    if (features.value.pushNotifications) {
      // Request notification permissions
      await requestNotificationPermission()
    }
  }
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('🔔 Notification permission granted')
      } else {
        console.log('🔕 Notification permission denied')
        features.value.pushNotifications = false
        saveSettings()
      }
    }
  }
  
  const showNotification = (title, options = {}) => {
    if (features.value.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      })
    }
  }
  
  const resetApp = () => {
    // Clear all stored data
    localStorage.clear()
    
    // Reset stores to initial state
    isLoading.value = false
    loadingMessage.value = ''
    errorMessage.value = ''
    lastError.value = null
    lastSyncTime.value = null
    syncStatus.value = 'idle'
    
    // Reset settings to defaults
    settings.value = {
      theme: 'auto',
      notifications: {
        workoutReminders: true,
        progressUpdates: true,
        motivationalMessages: true
      },
      sync: {
        autoSync: true,
        syncInterval: 5,
        wifiOnly: false
      },
      privacy: {
        dataCollection: false,
        crashReporting: true
      }
    }
    
    features.value = {
      googleSheetsIntegration: false,
      claudeAiIntegration: false,
      offlineMode: true,
      pushNotifications: false,
      analyticsTracking: false
    }
    
    console.log('🔄 App reset to initial state')
  }
  
  // Analytics and tracking (privacy-respecting)
  const trackEvent = (eventName, properties = {}) => {
    if (!features.value.analyticsTracking || !settings.value.privacy.dataCollection) {
      return
    }
    
    console.log('📊 Event tracked:', eventName, properties)
    // Could integrate with privacy-respecting analytics here
  }
  
  const trackError = (error, context = {}) => {
    if (!settings.value.privacy.crashReporting) {
      return
    }
    
    console.log('🐛 Error tracked:', error, context)
    // Could integrate with error tracking service here
  }
  
  // Initialize on store creation
  loadSettings()
  
  // Listen for online/offline events
  window.addEventListener('online', () => setOnlineStatus(true))
  window.addEventListener('offline', () => setOnlineStatus(false))
  
  return {
    // State
    isLoading,
    loadingMessage,
    errorMessage,
    lastError,
    isOnline,
    appVersion,
    lastSyncTime,
    syncStatus,
    features,
    settings,
    
    // Computed
    hasError,
    canSync,
    shouldShowOfflineIndicator,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setOnlineStatus,
    enableFeature,
    disableFeature,
    updateSettings,
    setSyncStatus,
    initializeApp,
    requestNotificationPermission,
    showNotification,
    resetApp,
    trackEvent,
    trackError,
    saveSettings,
    loadSettings
  }
})