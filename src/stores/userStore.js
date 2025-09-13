import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userService from '@/services/userService.js'

export const useUserStore = defineStore('user', () => {
  // Current active user
  const currentUser = ref('A')
  
  // Loading states
  const loading = ref({
    userProfiles: false,
    bodyComposition: false,
    weeklyStatus: false
  })
  
  // User profiles (loaded from Google Sheets)
  const userProfiles = ref({
    A: null,
    B: null
  })
  
  // User state management (local app state)
  const userStates = ref({
    A: {
      activeWorkout: null,
      checkedSets: {},
      sessionNotes: '',
      sessionDuration: '',
      sessionStartTime: null,
      workoutCompleted: false,
      weeklyStatus: {},
      lastWorkoutDate: null,
      lastWorkout: null,
      currentStreak: 0
    },
    B: {
      activeWorkout: null,
      checkedSets: {},
      sessionNotes: '',
      sessionDuration: '',
      sessionStartTime: null,
      workoutCompleted: false,
      weeklyStatus: {},
      lastWorkoutDate: null,
      lastWorkout: null,
      currentStreak: 0
    }
  })
  
  // Progress data (from Google Sheets)
  const progressData = ref({
    A: null,
    B: null
  })

  // Theme configuration (based on user goals)
  const themes = {
    A: {
      primary: 'purple-500',
      secondary: 'purple-600',
      light: 'purple-50',
      text: 'purple-700',
      bg: 'bg-purple-500'
    },
    B: {
      primary: 'pink-500',
      secondary: 'pink-600',
      light: 'pink-50',
      text: 'pink-700',
      bg: 'bg-pink-500'
    }
  }
  
  // Computed properties
  const getCurrentUserProfile = computed(() => userProfiles.value[currentUser.value])
  const getCurrentUserState = computed(() => userStates.value[currentUser.value])
  const getCurrentUserTheme = computed(() => themes[currentUser.value])
  const getCurrentProgressData = computed(() => progressData.value[currentUser.value])
  
  const isWorkoutActive = computed(() => getCurrentUserState.value.activeWorkout !== null)
  const currentUserColor = computed(() => themes[currentUser.value].bg)
  const isLoading = computed(() => Object.values(loading.value).some(l => l))

  // **BACKWARD COMPATIBILITY FUNCTIONS**
  // These functions support the existing component code
  
  const getUserState = (userId) => {
    return userStates.value[userId] || userStates.value[currentUser.value]
  }

  const getUserProfile = (userId) => {
    return userProfiles.value[userId] || userProfiles.value[currentUser.value]
  }

  const getUserTheme = (userId) => {
    return themes[userId] || themes[currentUser.value]
  }

  const getUserGoals = (userId) => {
    return progressData.value[userId] || progressData.value[currentUser.value]
  }

  const getUserName = (userId) => {
    const id = userId || currentUser.value
    const profile = userProfiles.value[id]
    
    if (profile) {
      return profile.name
    }
    
    // Fallback to default names
    return id === 'A' ? 'User A' : 'User B'
  }

  // Legacy current user methods (for backward compatibility)
  const updateCurrentUserState = (updates) => {
    updateUserState(currentUser.value, updates)
  }

  const updateCurrentUserProfile = (updates) => {
    updateUserProfile(currentUser.value, updates)
  }
  
  // API Actions
  const loadUserProfiles = async () => {
    try {
      loading.value.userProfiles = true
      const users = await userService.getAllUsers()
      
      users.forEach(user => {
        userProfiles.value[user.user_id] = user
      })
      
      console.log('✅ UserStore: Loaded user profiles from API')
    } catch (error) {
      console.error('❌ UserStore: Failed to load user profiles:', error)
      // Set fallback profiles if API fails
      userProfiles.value = {
        A: {
          user_id: 'A',
          name: 'User A',
          age: '28',
          goal: 'muscle_building',
          current_weight_kg: '48'
        },
        B: {
          user_id: 'B',
          name: 'User B',
          age: '27',
          goal: 'weight_loss',
          current_weight_kg: '67'
        }
      }
    } finally {
      loading.value.userProfiles = false
    }
  }

  const loadWeeklyStatus = async (userId) => {
    try {
      loading.value.weeklyStatus = true
      const weeklyStatus = await userService.getWeeklyStatus(userId)
      
      // Convert database format to app format
      const statusMap = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      }

      const appWeeklyStatus = {}
      Object.entries(statusMap).forEach(([dbKey, appKey]) => {
        appWeeklyStatus[appKey] = weeklyStatus[dbKey] || 'planned'
      })

      userStates.value[userId].weeklyStatus = appWeeklyStatus
      
      console.log(`✅ UserStore: Loaded weekly status for User ${userId}`)
    } catch (error) {
      console.error(`❌ UserStore: Failed to load weekly status for User ${userId}:`, error)
      // Use default status on error
      userStates.value[userId].weeklyStatus = getDefaultWeeklyStatus()
    } finally {
      loading.value.weeklyStatus = false
    }
  }

  const loadProgressData = async (userId) => {
    try {
      loading.value.bodyComposition = true
      const data = await userService.getProgressData(userId)
      progressData.value[userId] = data
      
      console.log(`✅ UserStore: Loaded progress data for User ${userId}`)
    } catch (error) {
      console.error(`❌ UserStore: Failed to load progress data for User ${userId}:`, error)
      // Set fallback progress data
      progressData.value[userId] = userService.getDefaultProgressData(userId)
    } finally {
      loading.value.bodyComposition = false
    }
  }

  const updateUserProfile = async (userId, updates) => {
    try {
      const updatedUser = await userService.updateUser(userId, updates)
      userProfiles.value[userId] = updatedUser
      
      console.log(`✅ UserStore: Updated profile for User ${userId}`)
      return updatedUser
    } catch (error) {
      console.error(`❌ UserStore: Failed to update User ${userId}:`, error)
      throw error
    }
  }

  const updateWeeklyStatus = async (userId, dayName, status) => {
    try {
      // Update local state immediately for better UX
      userStates.value[userId].weeklyStatus[dayName] = status
      
      // Convert app format to database format
      const dbStatusMap = {
        Monday: 'monday',
        Tuesday: 'tuesday', 
        Wednesday: 'wednesday',
        Thursday: 'thursday',
        Friday: 'friday',
        Saturday: 'saturday',
        Sunday: 'sunday'
      }

      const statusUpdates = {}
      statusUpdates[dbStatusMap[dayName]] = status

      await userService.updateWeeklyStatus(userId, statusUpdates)
      
      console.log(`✅ UserStore: Updated ${dayName} status to ${status} for User ${userId}`)
    } catch (error) {
      console.error(`❌ UserStore: Failed to update weekly status for User ${userId}:`, error)
      // Keep local state change even if API fails (for offline usage)
      console.log('⚠️ UserStore: Keeping local change, will retry on next sync')
    }
  }

  const addBodyMeasurement = async (userId, measurementData) => {
    try {
      const newMeasurement = await userService.addBodyMeasurement(userId, measurementData)
      
      // Reload progress data to reflect the new measurement
      await loadProgressData(userId)
      
      console.log(`✅ UserStore: Added body measurement for User ${userId}`)
      return newMeasurement
    } catch (error) {
      console.error(`❌ UserStore: Failed to add body measurement for User ${userId}:`, error)
      throw error
    }
  }

  // Local State Management (no API calls)
  const switchUser = (userId) => {
    if (userId === 'A' || userId === 'B') {
      currentUser.value = userId
      localStorage.setItem('currentUser', userId)
      console.log(`🔄 UserStore: Switched to User ${userId}`)
      
      // Load data for the new user if not already loaded
      if (!userProfiles.value[userId]) {
        loadUserProfiles()
      }
      if (!progressData.value[userId]) {
        loadProgressData(userId)
      }
      if (Object.keys(userStates.value[userId].weeklyStatus).length === 0) {
        loadWeeklyStatus(userId)
      }
    }
  }

  const updateUserState = (userId, updates) => {
    if (!userId || !userStates.value[userId]) {
      console.error(`❌ UserStore: Invalid userId: ${userId}`)
      return
    }
    
    userStates.value[userId] = {
      ...userStates.value[userId],
      ...updates
    }
    
    // Save to localStorage for persistence
    saveToLocalStorage()
    console.log(`🔄 UserStore: Updated local state for User ${userId}:`, Object.keys(updates))
  }

  const startWorkout = (userId, workout) => {
    if (!userId) {
      console.error('❌ UserStore: startWorkout: userId is required')
      return
    }
    
    updateUserState(userId, {
      activeWorkout: workout,
      checkedSets: {},
      sessionStartTime: new Date().toISOString(),
      sessionNotes: '',
      sessionDuration: '',
      workoutCompleted: false
    })
    
    console.log(`🏋️‍♀️ UserStore: User ${userId} started workout: ${workout?.title || 'Unknown'}`)
  }

  const completeWorkout = async (userId, sessionData = {}) => {
    if (!userId) {
      console.error('❌ UserStore: completeWorkout: userId is required')
      return
    }
    
    const userState = userStates.value[userId]
    if (!userState) {
      console.error(`❌ UserStore: completeWorkout: Invalid userId: ${userId}`)
      return
    }
    
    const endTime = new Date()
    const startTime = userState.sessionStartTime ? new Date(userState.sessionStartTime) : endTime
    const duration = Math.round((endTime - startTime) / 1000 / 60) // minutes
    
    // Update local state
    updateUserState(userId, {
      activeWorkout: null,
      workoutCompleted: true,
      lastWorkoutDate: endTime.toISOString(),
      sessionDuration: sessionData.sessionDuration || `${duration}`,
      sessionNotes: sessionData.sessionNotes || '',
      lastWorkout: sessionData.workout || userState.activeWorkout
    })
    
    // Update weekly status (both local and API)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    await updateWeeklyStatus(userId, today, 'completed')
    
    console.log(`✅ UserStore: User ${userId} completed workout in ${duration} minutes`)
  }

  const cancelWorkout = (userId, reason = '') => {
    if (!userId) {
      console.error('❌ UserStore: cancelWorkout: userId is required')
      return
    }
    
    updateUserState(userId, {
      activeWorkout: null,
      checkedSets: {},
      sessionNotes: reason,
      workoutCompleted: false
    })
    
    console.log(`❌ UserStore: User ${userId} cancelled workout: ${reason}`)
  }

  const cancelDay = async (userId, dayName, reason = '') => {
    await updateWeeklyStatus(userId, dayName, 'cancelled')
    console.log(`📅 UserStore: User ${userId} cancelled ${dayName}: ${reason}`)
  }

  const rescheduleDay = async (userId, fromDay, toDay) => {
    // Cancel the original day
    await updateWeeklyStatus(userId, fromDay, 'cancelled')
    
    // Schedule the new day (if it's not already completed)
    const currentStatus = userStates.value[userId].weeklyStatus[toDay]
    if (currentStatus !== 'completed') {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      const newStatus = toDay === today ? 'today' : 'planned'
      await updateWeeklyStatus(userId, toDay, newStatus)
    }
    
    console.log(`📅 UserStore: User ${userId} rescheduled ${fromDay} to ${toDay}`)
  }

  const toggleSetCompletion = (userId, exerciseId, setIndex) => {
    if (!userId || !userStates.value[userId]) return
    
    const key = `${exerciseId}-${setIndex}`
    const checkedSets = { ...userStates.value[userId].checkedSets }
    
    if (checkedSets[key]) {
      delete checkedSets[key]
    } else {
      checkedSets[key] = {
        completed: true,
        timestamp: new Date().toISOString()
      }
    }
    
    updateUserState(userId, { checkedSets })
  }

  // Default weekly status
  const getDefaultWeeklyStatus = () => ({
    Monday: 'planned',
    Tuesday: 'today',
    Wednesday: 'planned', 
    Thursday: 'planned',
    Friday: 'planned',
    Saturday: 'planned',
    Sunday: 'rest'
  })

  // Persistence (local storage for app state only)
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('userStates', JSON.stringify(userStates.value))
    } catch (error) {
      console.error('UserStore: Error saving to localStorage:', error)
    }
  }
  
  const loadFromLocalStorage = () => {
    try {
      const savedCurrentUser = localStorage.getItem('currentUser')
      if (savedCurrentUser && ['A', 'B'].includes(savedCurrentUser)) {
        currentUser.value = savedCurrentUser
      }
      
      const savedUserStates = localStorage.getItem('userStates')
      if (savedUserStates) {
        const parsed = JSON.parse(savedUserStates)
        // Only restore local state, not API data
        Object.keys(parsed).forEach(userId => {
          if (userStates.value[userId]) {
            userStates.value[userId] = {
              ...userStates.value[userId],
              ...parsed[userId]
            }
          }
        })
      }
      
      console.log('📱 UserStore: Loaded local state from localStorage')
    } catch (error) {
      console.error('UserStore: Error loading from localStorage:', error)
    }
  }

  // Initialize store
  const initializeStore = async () => {
    console.log('🚀 UserStore: Initializing...')
    
    // Load local state first
    loadFromLocalStorage()
    
    // Load API data
    await loadUserProfiles()
    
    // Load data for current user
    const userId = currentUser.value
    await Promise.all([
      loadProgressData(userId),
      loadWeeklyStatus(userId)
    ])
    
    console.log('✅ UserStore: Initialization complete')
  }

  // Auto-initialize
  initializeStore()
  
  return {
    // State
    currentUser,
    userProfiles,
    userStates,
    progressData,
    loading,
    
    // Computed
    getCurrentUserProfile,
    getCurrentUserState,
    getCurrentUserTheme,
    getCurrentProgressData,
    isWorkoutActive,
    currentUserColor,
    isLoading,

    // **BACKWARD COMPATIBILITY** - Support existing components
    getUserState,
    getUserProfile,
    getUserTheme,
    getUserGoals,
    getUserName,
    updateCurrentUserState,
    updateCurrentUserProfile,
    
    // API Actions
    loadUserProfiles,
    loadWeeklyStatus,
    loadProgressData,
    updateUserProfile,
    updateWeeklyStatus,
    addBodyMeasurement,
    
    // Local Actions
    switchUser,
    updateUserState,
    startWorkout,
    completeWorkout,
    cancelWorkout,
    cancelDay,
    rescheduleDay,
    toggleSetCompletion,
    
    // Utility
    saveToLocalStorage,
    initializeStore
  }
})