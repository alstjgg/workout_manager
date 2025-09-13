<template>
  <div :style="pageStyles">
    <!-- Active Workout View -->
    <ActiveWorkout
      v-if="isWorkoutActive"
      :current-user="currentUser"
      @workout-finished="handleWorkoutFinished"
      @workout-paused="handleWorkoutPaused"
    />

    <!-- Normal Today View -->
    <template v-else>
      <!-- Welcome Section -->
      <div :style="welcomeStyles">
        <h2 :style="welcomeTitleStyles">
          Welcome back, {{ getUserName() }}! ✨
        </h2>
        <p :style="welcomeSubStyles">{{ getMotivationalMessage() }}</p>
      </div>

      <!-- Workout Completed Success -->
      <div v-if="isWorkoutCompleted" :style="successCardStyles">
        <div :style="successIconStyles">🎉</div>
        <h3 :style="successTitleStyles">Workout Completed!</h3>
        <p :style="successMessageStyles">
          Great job! You completed your {{ userState.lastWorkout?.title || 'workout' }} 
          in {{ userState.sessionDuration }}.
        </p>
        <div :style="successStatsStyles">
          <div>Progress: {{ userState.lastWorkout?.progress || 0 }}%</div>
          <div>Duration: {{ userState.sessionDuration }}</div>
        </div>
        <button 
          @click="resetWorkoutCompletion"
          :style="resetButtonStyles"
        >
          Reset for Testing
        </button>
      </div>

      <!-- Today's Workout Card -->
      <WorkoutCard
        v-if="todaysWorkout && !isWorkoutCompleted"
        :title="'Today\'s Workout'"
        :subtitle="todaysWorkout.description"
        :badge="getCurrentDay()"
        :workout="todaysWorkout"
        :focus-areas="getFocusAreas()"
        :show-details="true"
        :show-start-button="true"
        :button-text="getStartButtonText()"
        :current-user="currentUser"
        @start-workout="startWorkout"
      />

      <!-- Quick Stats -->
      <StatsGrid
        :stats="quickStats"
        :current-user="currentUser"
      />

      <!-- Workout Preview -->
      <div v-if="todaysWorkout && !isWorkoutCompleted" :style="workoutPreviewStyles">
        <h3 :style="previewTitleStyles">Today's Exercises</h3>
        <div :style="exercisesListStyles">
          <div
            v-for="(exercise, index) in todaysWorkout.exercises"
            :key="exercise.id"
            :style="exercisePreviewStyles"
          >
            <div :style="exerciseNumberStyles">{{ index + 1 }}</div>
            <div>
              <div :style="exerciseNameStyles">{{ exercise.name }}</div>
              <div :style="exerciseDetailsStyles">
                {{ exercise.sets }} sets • {{ exercise.reps }} • {{ exercise.weight }}
              </div>
            </div>
            <div :style="exerciseCategoryStyles">{{ exercise.category }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useUserStore } from '@/stores/userStore'
import WorkoutCard from '@/components/workout/WorkoutCard.vue'
import StatsGrid from '@/components/common/StatsGrid.vue'
import ActiveWorkout from '@/components/workout/ActiveWorkout.vue'

// Props
const props = defineProps({
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Stores
const workoutStore = useWorkoutStore()
const userStore = useUserStore()

// FIXED: Use WorkoutStore as single source of truth for active workout state
const isWorkoutActive = computed(() => workoutStore.isWorkoutActive(props.currentUser))
const isWorkoutPaused = computed(() => workoutStore.isWorkoutPaused(props.currentUser))
const todaysWorkout = computed(() => workoutStore.getCurrentUserWorkout(props.currentUser))

// Use UserStore for completion state (but WorkoutStore for active state)
const userState = computed(() => userStore.getUserState(props.currentUser))
const isWorkoutCompleted = computed(() => userState.value?.workoutCompleted || false)

const quickStats = computed(() => {
  const baseStats = props.currentUser === 'A' 
    ? { streak: userState.value?.currentStreak || 5, weekProgress: 67 }
    : { streak: userState.value?.currentStreak || 3, weekProgress: 50 }

  return [
    { 
      id: 'streak', 
      value: baseStats.streak, 
      label: 'Day Streak', 
      icon: '🔥' 
    },
    { 
      id: 'progress', 
      value: `${baseStats.weekProgress}%`, 
      label: 'Week Progress', 
      icon: '📊' 
    }
  ]
})

// Computed styles (same as before)
const pageStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
}))

const welcomeStyles = computed(() => ({ 
  textAlign: 'center' 
}))

const welcomeTitleStyles = computed(() => ({
  fontSize: '30px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 12px 0'
}))

const welcomeSubStyles = computed(() => ({
  fontSize: '18px',
  color: '#6b7280',
  margin: '0'
}))

const successCardStyles = computed(() => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '24px',
  textAlign: 'center',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '2px solid #10b981',
  background: 'linear-gradient(to bottom right, #ecfdf5, #ffffff)'
}))

const successIconStyles = computed(() => ({
  fontSize: '48px',
  marginBottom: '16px'
}))

const successTitleStyles = computed(() => ({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#065f46',
  margin: '0 0 12px 0'
}))

const successMessageStyles = computed(() => ({
  fontSize: '16px',
  color: '#047857',
  marginBottom: '16px',
  margin: '0 0 16px 0'
}))

const successStatsStyles = computed(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#047857',
  marginBottom: '16px'
}))

const resetButtonStyles = computed(() => ({
  padding: '8px 16px',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  cursor: 'pointer'
}))

const workoutPreviewStyles = computed(() => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid #f3f4f6'
}))

const previewTitleStyles = computed(() => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '16px',
  margin: '0 0 16px 0'
}))

const exercisesListStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}))

const exercisePreviewStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
}))

const exerciseNumberStyles = computed(() => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  flexShrink: '0'
}))

const exerciseNameStyles = computed(() => ({
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '4px'
}))

const exerciseDetailsStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280'
}))

const exerciseCategoryStyles = computed(() => ({
  fontSize: '12px',
  fontWeight: '500',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  backgroundColor: props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8',
  padding: '4px 8px',
  borderRadius: '12px'
}))

// Methods
const getUserName = () => {
  return props.currentUser === 'A' ? 'User A (Muscle Building)' : 'User B (Weight Loss)'
}

const getCurrentDay = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' })
}

const getMotivationalMessage = () => {
  if (isWorkoutCompleted.value) {
    return props.currentUser === 'A'
      ? 'Excellent work on your muscle building journey! 🏗️'
      : 'Amazing progress on your weight loss goals! 🎯'
  }
  
  const messages = { 
    A: 'Ready to build some serious strength today! 💪', 
    B: 'Time to crush those fitness goals! 🔥' 
  }
  return messages[props.currentUser]
}

const getFocusAreas = () => {
  const areas = { 
    A: ['Glutes', 'Hip Abduction', 'Shoulders', 'Form Focus'], 
    B: ['Glutes', 'Shoulders', 'Cardio Finish', 'Fat Burn'] 
  }
  return areas[props.currentUser]
}

const getStartButtonText = () => {
  if (isWorkoutActive.value) {
    return 'Continue Workout'
  }
  if (isWorkoutPaused.value) {
    return 'Resume Workout'
  }
  if (isWorkoutCompleted.value) {
    return 'Workout Completed'
  }
  return 'Start Today\'s Workout'
}

const startWorkout = async (workoutData) => {
  console.log(`🏋️‍♀️ User ${props.currentUser}: Start workout requested`)
  
  if (isWorkoutActive.value) {
    // Continue existing workout
    console.log('Continuing active workout')
    return
  }
  
  if (isWorkoutPaused.value) {
    // Resume paused workout
    console.log('Resuming paused workout')
    workoutStore.resumeWorkout(props.currentUser)
    return
  }
  
  if (isWorkoutCompleted.value) {
    alert('🎉 You\'ve already completed today\'s workout! Great job!')
    return
  }

  console.log(`🏋️‍♀️ Starting ${workoutData.title} for ${getUserName()}`)
  
  // Start the workout - this will sync both stores
  workoutStore.startWorkout(props.currentUser, todaysWorkout.value)
  
  // FIXED: Force reactivity update
  await nextTick()
  
  console.log(`✅ User ${props.currentUser}: Workout started, isActive: ${isWorkoutActive.value}`)
}

const resetWorkoutCompletion = () => {
  console.log(`🔄 User ${props.currentUser}: Resetting workout completion for testing`)
  
  // Reset both stores to ensure consistency
  userStore.updateUserState(props.currentUser, {
    workoutCompleted: false,
    activeWorkout: null,
    sessionNotes: '',
    sessionDuration: '',
    lastWorkout: null
  })
  
  // Also reset the weekly status to 'today'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  userStore.updateWeeklyStatus(props.currentUser, today, 'today')
  
  console.log(`🔄 User ${props.currentUser}: Reset complete`)
}

const handleWorkoutFinished = () => {
  console.log(`✅ User ${props.currentUser}: Workout finished!`)
  // The stores are now synced automatically through syncWithUserStore
}

const handleWorkoutPaused = () => {
  console.log(`⏸️ User ${props.currentUser}: Workout paused`)
  // Could show paused state or navigation options
}

// FIXED: Watch for both completion state AND active workout state changes
watch([isWorkoutCompleted, isWorkoutActive], 
  ([completed, active]) => {
    console.log(`🔄 TodayView User ${props.currentUser}: State changed - Completed: ${completed}, Active: ${active}`)
  }, 
  { immediate: true }
)

// Watch for user changes
watch(() => props.currentUser, (newUser) => {
  console.log(`👤 TodayView: User changed to ${newUser}`)
  console.log(`📊 User ${newUser} workout state - Active: ${isWorkoutActive.value}, Completed: ${isWorkoutCompleted.value}`)
})

onMounted(() => {
  console.log(`📱 TodayView mounted for user: ${props.currentUser}`)
  console.log(`📊 Initial state - Active: ${isWorkoutActive.value}, Completed: ${isWorkoutCompleted.value}`)
  console.log(`🔍 Current user state:`, userState.value)
})
</script>