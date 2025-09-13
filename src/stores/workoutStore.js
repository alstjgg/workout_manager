import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkoutStore = defineStore('workout', () => {
  // ============ STATE ============
  
  // REMOVED: Global activeWorkout - now user-specific
  // const activeWorkout = ref(null)  ❌
  
  const workoutStatus = ref('idle') // 'idle', 'active', 'paused', 'completed'
  
  // Force reactivity updates for timer - this will be updated every second
  const currentTime = ref(Date.now())
  
  // Exercise tracking
  const currentExerciseIndex = ref(0)
  const exerciseProgress = ref({})
  const sessionNotes = ref('')
  
  // User-specific workout states - FIXED: Now includes activeWorkout per user
  const userWorkoutStates = ref({
    A: {
      // ADDED: User-specific active workout
      activeWorkout: null,
      // Timer states - USER SPECIFIC
      workoutStartTime: null,
      currentSetTimer: {
        isRunning: false,
        startTime: null,
        duration: 0,
        exerciseId: null,
        setIndex: null
      },
      restTimer: {
        isRunning: false,
        startTime: null,
        duration: 0
      },
      // Workout tracking
      checkedSets: {},
      setTimings: {},
      sessionDuration: '',
      workoutCompleted: false,
      lastWorkout: null,
      totalSets: 0,
      completedSets: 0,
      totalWorkoutTime: 0
    },
    B: {
      // ADDED: User-specific active workout
      activeWorkout: null,
      // Timer states - USER SPECIFIC
      workoutStartTime: null,
      currentSetTimer: {
        isRunning: false,
        startTime: null,
        duration: 0,
        exerciseId: null,
        setIndex: null
      },
      restTimer: {
        isRunning: false,
        startTime: null,
        duration: 0
      },
      // Workout tracking
      checkedSets: {},
      setTimings: {},
      sessionDuration: '',
      workoutCompleted: false,
      lastWorkout: null,
      totalSets: 0,
      completedSets: 0,
      totalWorkoutTime: 0
    }
  })
  
  // Today's workout data (same as before)
  const todayWorkouts = ref({
    A: {
      id: 'workout-a-001',
      title: 'Glutes & Shoulders',
      description: 'Focus on lower body strength and shoulder development',
      duration: '60 min',
      targetMuscles: ['Glutes', 'Shoulders', 'Hip Abductors'],
      exercises: [
        {
          id: 'ex-1',
          name: 'Barbell Hip Thrust',
          category: 'Glutes',
          sets: 4,
          reps: '8-12',
          weight: 'Progressive',
          restTime: '90s',
          notes: 'Focus on hip extension, pause at top',
          setDetails: [
            { reps: 10, weight: '40kg', completed: false, timing: 0 },
            { reps: 8, weight: '45kg', completed: false, timing: 0 },
            { reps: 8, weight: '45kg', completed: false, timing: 0 },
            { reps: 6, weight: '50kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-2',
          name: 'Bulgarian Split Squats',
          category: 'Glutes',
          sets: 3,
          reps: '12 each leg',
          weight: '15kg dumbbells',
          restTime: '60s',
          notes: 'Control the descent, drive through front heel',
          setDetails: [
            { reps: '12 each', weight: '15kg', completed: false, timing: 0 },
            { reps: '12 each', weight: '15kg', completed: false, timing: 0 },
            { reps: '10 each', weight: '15kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-3',
          name: 'Hip Abduction Machine',
          category: 'Glutes',
          sets: 3,
          reps: '15-20',
          weight: 'Stack 6-8',
          restTime: '45s',
          notes: 'Squeeze glutes, controlled movement',
          setDetails: [
            { reps: 20, weight: 'Stack 6', completed: false, timing: 0 },
            { reps: 18, weight: 'Stack 7', completed: false, timing: 0 },
            { reps: 15, weight: 'Stack 8', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-4',
          name: 'Overhead Press',
          category: 'Shoulders',
          sets: 4,
          reps: '8-10',
          weight: '12kg barbell',
          restTime: '90s',
          notes: 'Keep core tight, press straight up',
          setDetails: [
            { reps: 10, weight: '12kg', completed: false, timing: 0 },
            { reps: 8, weight: '12kg', completed: false, timing: 0 },
            { reps: 8, weight: '12kg', completed: false, timing: 0 },
            { reps: 6, weight: '15kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-5',
          name: 'Lateral Raises',
          category: 'Shoulders',
          sets: 3,
          reps: '12-15',
          weight: '5kg dumbbells',
          restTime: '45s',
          notes: 'Control on the way down, slight bend in elbows',
          setDetails: [
            { reps: 15, weight: '5kg', completed: false, timing: 0 },
            { reps: 12, weight: '5kg', completed: false, timing: 0 },
            { reps: 12, weight: '5kg', completed: false, timing: 0 }
          ]
        }
      ]
    },
    B: {
      id: 'workout-b-001',
      title: 'Glutes & Shoulders + Cardio',
      description: 'Strength training with cardio finish for weight loss',
      duration: '70 min',
      targetMuscles: ['Glutes', 'Shoulders', 'Cardio'],
      exercises: [
        {
          id: 'ex-1',
          name: 'Goblet Squats',
          category: 'Glutes',
          sets: 4,
          reps: '15-20',
          weight: '12kg dumbbell',
          restTime: '60s',
          notes: 'Full depth, chest up',
          setDetails: [
            { reps: 20, weight: '12kg', completed: false, timing: 0 },
            { reps: 18, weight: '12kg', completed: false, timing: 0 },
            { reps: 15, weight: '12kg', completed: false, timing: 0 },
            { reps: 15, weight: '12kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-2',
          name: 'Romanian Deadlifts',
          category: 'Glutes',
          sets: 3,
          reps: '12-15',
          weight: '15kg barbell',
          restTime: '60s',
          notes: 'Feel the stretch in hamstrings',
          setDetails: [
            { reps: 15, weight: '15kg', completed: false, timing: 0 },
            { reps: 12, weight: '15kg', completed: false, timing: 0 },
            { reps: 12, weight: '15kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-3',
          name: 'Glute Bridges',
          category: 'Glutes',
          sets: 3,
          reps: '20',
          weight: 'Bodyweight',
          restTime: '45s',
          notes: 'Squeeze at the top for 2 seconds',
          setDetails: [
            { reps: 20, weight: 'Bodyweight', completed: false, timing: 0 },
            { reps: 20, weight: 'Bodyweight', completed: false, timing: 0 },
            { reps: 20, weight: 'Bodyweight', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-4',
          name: 'Dumbbell Shoulder Press',
          category: 'Shoulders',
          sets: 3,
          reps: '12-15',
          weight: '7kg dumbbells',
          restTime: '60s',
          notes: 'Controlled movement, full range',
          setDetails: [
            { reps: 15, weight: '7kg', completed: false, timing: 0 },
            { reps: 12, weight: '7kg', completed: false, timing: 0 },
            { reps: 12, weight: '7kg', completed: false, timing: 0 }
          ]
        },
        {
          id: 'ex-5',
          name: 'Cardio Circuit',
          category: 'Cardio',
          sets: 1,
          reps: '15 min',
          weight: 'Bodyweight',
          restTime: '30s between exercises',
          notes: 'Treadmill intervals: 2min walk, 1min jog',
          setDetails: [
            { reps: '15 min', weight: 'Bodyweight', completed: false, timing: 0 }
          ]
        }
      ]
    }
  })

  // Timer interval reference - SINGLE interval for all users
  let timerInterval = null
  let activeUsers = new Set() // Track which users have active timers

  // ============ GETTERS ============
  
  const getCurrentUserWorkout = computed(() => (currentUser) => {
    return todayWorkouts.value[currentUser]
  })
  
  const getCurrentUserState = computed(() => (currentUser) => {
    return userWorkoutStates.value[currentUser]
  })
  
  const getWorkoutProgress = computed(() => (currentUser) => {
    const state = userWorkoutStates.value[currentUser]
    if (state.totalSets === 0) return 0
    return Math.round((state.completedSets / state.totalSets) * 100)
  })
  
  // FIXED: Check user-specific activeWorkout instead of global
  const isWorkoutActive = computed(() => (currentUser) => {
    return userWorkoutStates.value[currentUser]?.activeWorkout !== null
  })
  
  const isWorkoutPaused = computed(() => (currentUser) => {
    return workoutStatus.value === 'paused' && activeUsers.has(currentUser)
  })
  
  // FIXED: User-specific timer display
  const getCurrentTimerDisplay = computed(() => (currentUser) => {
    // Force reactivity by accessing currentTime
    const now = currentTime.value
    const userState = userWorkoutStates.value[currentUser]
    
    if (userState.currentSetTimer.isRunning) {
      // Set timer is running
      if (!userState.currentSetTimer.startTime) return '00:00' // Safety check
      const elapsed = Math.floor((now - userState.currentSetTimer.startTime) / 1000)
      return formatTime(Math.max(0, elapsed)) // Prevent negative values
    } else if (userState.restTimer.isRunning) {
      // Rest timer is running
      if (!userState.restTimer.startTime) return '00:00' // Safety check
      const elapsed = Math.floor((now - userState.restTimer.startTime) / 1000)
      return formatTime(Math.max(0, elapsed)) // Prevent negative values
    } else {
      // No timer running
      return '00:00'
    }
  })
  
  // FIXED: User-specific timer status
  const getTimerStatus = computed(() => (currentUser) => {
    const userState = userWorkoutStates.value[currentUser]
    if (userState.currentSetTimer.isRunning) return 'SET'
    if (userState.restTimer.isRunning) return 'REST'
    return 'READY'
  })
  
  // FIXED: User-specific total workout time
  const getTotalWorkoutTime = computed(() => (currentUser) => {
    const state = userWorkoutStates.value[currentUser]
    return formatTime(state.totalWorkoutTime)
  })

  // NEW: Get user-specific active workout
  const getUserActiveWorkout = computed(() => (currentUser) => {
    return userWorkoutStates.value[currentUser]?.activeWorkout
  })

  // ============ ACTIONS ============
  
  function startTimerInterval() {
    if (timerInterval) return // Already running
    
    timerInterval = setInterval(() => {
      currentTime.value = Date.now() // Update current time to trigger reactivity
    }, 1000)
    
    console.log('⏱️ Global timer interval started')
  }
  
  function stopTimerInterval() {
    // Only stop if no users have active timers
    if (activeUsers.size === 0 && timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
      console.log('⏹️ Global timer interval stopped')
    }
  }
  
  function startWorkout(currentUser, workout) {
    console.log(`🏋️‍♀️ Starting workout for User ${currentUser}:`, workout.title)
    
    // FIXED: Set user-specific activeWorkout instead of global
    userWorkoutStates.value[currentUser].activeWorkout = workout
    userWorkoutStates.value[currentUser].workoutStartTime = new Date()
    workoutStatus.value = 'active'
    currentExerciseIndex.value = 0
    
    // Track this user as having an active workout
    activeUsers.add(currentUser)
    
    // Start the timer interval for real-time updates
    startTimerInterval()
    
    // Initialize exercise progress tracking
    exerciseProgress.value = {}
    workout.exercises.forEach(exercise => {
      exerciseProgress.value[exercise.id] = {
        completedSets: 0,
        totalSets: exercise.sets,
        setData: exercise.setDetails.map(() => ({ completed: false, timing: 0 }))
      }
    })
    
    // Calculate total sets for progress tracking
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    userWorkoutStates.value[currentUser] = {
      ...userWorkoutStates.value[currentUser],
      checkedSets: {},
      setTimings: {},
      workoutCompleted: false,
      totalSets,
      completedSets: 0,
      totalWorkoutTime: 0
    }

    // 🔥 Sync with specific user - now syncs activeWorkout too
    syncWithUserStore(currentUser, 'START_WORKOUT', { workout })
    
    console.log(`✅ User ${currentUser}: Workout started successfully`)
  }
  
  function startSet(currentUser, exerciseId, setIndex) {
    const now = Date.now()
    const userState = userWorkoutStates.value[currentUser]
    
    // Stop any existing timers for this user
    if (userState.currentSetTimer.isRunning) {
      endSet(currentUser, userState.currentSetTimer.exerciseId, userState.currentSetTimer.setIndex)
    }
    if (userState.restTimer.isRunning) {
      userState.restTimer.isRunning = false
    }
    
    // Start set timer for this specific user
    userState.currentSetTimer = {
      isRunning: true,
      startTime: now,
      duration: 0,
      exerciseId,
      setIndex
    }
    
    // Ensure timer interval is running
    startTimerInterval()
    
    console.log(`⏱️ User ${currentUser}: Started set timer for set ${setIndex + 1} of exercise ${exerciseId}`)
  }
  
  function endSet(currentUser, exerciseId, setIndex) {
    const userState = userWorkoutStates.value[currentUser]
    if (!userState.currentSetTimer.isRunning) return
    
    const endTime = Date.now()
    const duration = Math.floor((endTime - userState.currentSetTimer.startTime) / 1000)
    
    // Mark set as completed
    const setKey = `${exerciseId}-${setIndex}`
    userState.checkedSets[setKey] = true
    userState.setTimings[setKey] = duration
    userState.completedSets++
    userState.totalWorkoutTime += duration
    
    // Update exercise progress
    if (exerciseProgress.value[exerciseId]) {
      exerciseProgress.value[exerciseId].completedSets++
      exerciseProgress.value[exerciseId].setData[setIndex] = {
        completed: true,
        timing: duration,
        timestamp: new Date().toISOString()
      }
    }
    
    // Stop set timer for this user
    userState.currentSetTimer = {
      isRunning: false,
      startTime: null,
      duration: 0,
      exerciseId: null,
      setIndex: null
    }
    
    // Start rest timer for this user
    userState.restTimer = {
      isRunning: true,
      startTime: Date.now(),
      duration: 0
    }
    
    console.log(`✅ User ${currentUser}: Completed set ${setIndex + 1} of exercise ${exerciseId} in ${formatTime(duration)}`)
    console.log(`⏰ User ${currentUser}: Started rest timer`)
  }
  
  function pauseWorkout(currentUser) {
    const userState = userWorkoutStates.value[currentUser]
    workoutStatus.value = 'paused'
    
    // Pause any running timers for this user
    if (userState.currentSetTimer.isRunning) {
      const elapsed = Math.floor((Date.now() - userState.currentSetTimer.startTime) / 1000)
      userState.currentSetTimer.duration = elapsed
      userState.currentSetTimer.isRunning = false
    }
    
    if (userState.restTimer.isRunning) {
      const elapsed = Math.floor((Date.now() - userState.restTimer.startTime) / 1000)
      userState.restTimer.duration = elapsed
      userState.restTimer.isRunning = false
    }
    
    console.log(`⏸️ User ${currentUser}: Workout paused`)
  }
  
  function resumeWorkout(currentUser) {
    const userState = userWorkoutStates.value[currentUser]
    workoutStatus.value = 'active'
    
    // Resume timers if they were running for this user
    const now = Date.now()
    
    if (userState.currentSetTimer.exerciseId && userState.currentSetTimer.duration > 0) {
      userState.currentSetTimer.startTime = now - (userState.currentSetTimer.duration * 1000)
      userState.currentSetTimer.isRunning = true
    }
    
    if (userState.restTimer.duration > 0 && !userState.currentSetTimer.isRunning) {
      userState.restTimer.startTime = now - (userState.restTimer.duration * 1000)
      userState.restTimer.isRunning = true
    }
    
    // Ensure timer interval is running
    startTimerInterval()
    
    console.log(`▶️ User ${currentUser}: Workout resumed`)
  }
  
  function completeWorkout(currentUser, notes = '') {
    const userState = userWorkoutStates.value[currentUser]
    const totalTime = userState.totalWorkoutTime
    const duration = formatTime(totalTime)
    
    userState.workoutCompleted = true
    userState.sessionDuration = duration
    userState.lastWorkout = {
      ...userState.activeWorkout, // FIXED: Use user-specific activeWorkout
      completedAt: new Date().toISOString(),
      duration,
      progress: getWorkoutProgress.value(currentUser),
      totalTime: totalTime
    }
    
    // FIXED: Clear user-specific activeWorkout
    userState.activeWorkout = null
    
    // Stop all timers for this user
    userState.currentSetTimer = {
      isRunning: false,
      startTime: null,
      duration: 0,
      exerciseId: null,
      setIndex: null
    }
    userState.restTimer = {
      isRunning: false,
      startTime: null,
      duration: 0
    }
    
    // Remove this user from active users
    activeUsers.delete(currentUser)
    
    sessionNotes.value = notes
    workoutStatus.value = 'completed'
    
    // Stop global timer if no users are active
    stopTimerInterval()

    // Sync with userStore - now clears activeWorkout too
    syncWithUserStore(currentUser, 'COMPLETE_WORKOUT', {
      sessionNotes: notes,
      sessionDuration: duration,
      totalTime,
      progress: getWorkoutProgress.value(currentUser),
      workout: userState.lastWorkout
    })
    
    console.log(`🎉 User ${currentUser}: Workout completed! Duration: ${duration}`)
    
    // Reset global state after delay if no users are active
    setTimeout(() => {
      if (activeUsers.size === 0) {
        workoutStatus.value = 'idle'
        exerciseProgress.value = {}
        sessionNotes.value = ''
      }
    }, 2000)
  }
  
  function cancelWorkout(currentUser) {
    const userState = userWorkoutStates.value[currentUser]
    
    // Reset user state - FIXED: Clear user-specific activeWorkout
    userWorkoutStates.value[currentUser] = {
      ...userState,
      activeWorkout: null, // FIXED: Clear user-specific activeWorkout
      checkedSets: {},
      setTimings: {},
      sessionDuration: '',
      workoutCompleted: false,
      lastWorkout: null,
      totalSets: 0,
      completedSets: 0,
      totalWorkoutTime: 0,
      currentSetTimer: {
        isRunning: false,
        startTime: null,
        duration: 0,
        exerciseId: null,
        setIndex: null
      },
      restTimer: {
        isRunning: false,
        startTime: null,
        duration: 0
      }
    }
    
    // Remove this user from active users
    activeUsers.delete(currentUser)
    
    // Stop global timer if no users are active
    if (activeUsers.size === 0) {
      workoutStatus.value = 'idle'
      exerciseProgress.value = {}
      sessionNotes.value = ''
      stopTimerInterval()
    }

    // Sync with userStore - now clears activeWorkout too
    syncWithUserStore(currentUser, 'CANCEL_WORKOUT', {})
    
    console.log(`❌ User ${currentUser}: Workout cancelled`)
  }
  
  function isSetCompleted(currentUser, exerciseId, setIndex) {
    const setKey = `${exerciseId}-${setIndex}`
    return !!userWorkoutStates.value[currentUser].checkedSets[setKey]
  }
  
  function isSetInProgress(currentUser, exerciseId, setIndex) {
    const userState = userWorkoutStates.value[currentUser]
    return userState.currentSetTimer.isRunning && 
           userState.currentSetTimer.exerciseId === exerciseId && 
           userState.currentSetTimer.setIndex === setIndex
  }
  
  function getSetTiming(currentUser, exerciseId, setIndex) {
    const setKey = `${exerciseId}-${setIndex}`
    return userWorkoutStates.value[currentUser].setTimings[setKey] || 0
  }

  // FIXED: Sync function now handles activeWorkout properly
  function syncWithUserStore(targetUserId, action, data = {}) {
    // Lazy import to avoid circular dependencies
    import('@/stores/userStore').then(({ useUserStore }) => {
      const userStore = useUserStore()
      
      switch (action) {
        case 'START_WORKOUT':
          // Pass the specific userId and workout to the userStore method
          userStore.startWorkout(targetUserId, data.workout)
          console.log(`🔄 Synced START_WORKOUT to userStore for User ${targetUserId}`)
          break
          
        case 'COMPLETE_WORKOUT':
          // Pass the specific userId to the userStore method
          userStore.completeWorkout(targetUserId, {
            sessionNotes: data.sessionNotes,
            sessionDuration: data.sessionDuration,
            workout: data.workout
          })
          console.log(`🔄 Synced COMPLETE_WORKOUT to userStore for User ${targetUserId}`)
          break
          
        case 'CANCEL_WORKOUT':
          // Pass the specific userId to the userStore method
          userStore.cancelWorkout(targetUserId)
          console.log(`🔄 Synced CANCEL_WORKOUT to userStore for User ${targetUserId}`)
          break
          
        default:
          console.warn(`⚠️ Unknown sync action: ${action}`)
      }
    }).catch(error => {
      console.error('Failed to sync with userStore:', error)
    })
  }
  
  // Helper function to format time
  function formatTime(seconds) {
    if (!seconds || seconds < 0) return '00:00' // Safety check for invalid values
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Return everything for the store
  return {
    // State
    workoutStatus,
    currentExerciseIndex,
    exerciseProgress,
    sessionNotes,
    userWorkoutStates,
    todayWorkouts,
    currentTime,
    
    // Getters
    getCurrentUserWorkout,
    getCurrentUserState,
    getWorkoutProgress,
    isWorkoutActive,
    isWorkoutPaused,
    getCurrentTimerDisplay,
    getTimerStatus,
    getTotalWorkoutTime,
    getUserActiveWorkout,
    
    // Actions
    startWorkout,
    startSet,
    endSet,
    pauseWorkout,
    resumeWorkout,
    completeWorkout,
    cancelWorkout,
    isSetCompleted,
    isSetInProgress,
    getSetTiming,
    formatTime,
    startTimerInterval,
    stopTimerInterval,
    syncWithUserStore
  }
})