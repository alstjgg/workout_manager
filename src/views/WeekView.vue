<!-- Clean WeekView.vue - Production version without debug logs -->
<template>
  <div :style="pageStyles">
    <!-- Header -->
    <div :style="welcomeStyles">
      <h2 :style="welcomeTitleStyles">Weekly Overview</h2>
      <p :style="welcomeSubStyles">{{ getUserName() }}'s workout schedule</p>
    </div>

    <!-- Weekly Schedule -->
    <WorkoutCard
      title="This Week"
      :current-user="currentUser"
    >
      <WeekSchedule
        :week-days="dynamicWeekDays"
        :current-user="currentUser"
        @day-clicked="handleDayClick"
      />
    </WorkoutCard>

    <!-- Weekly Stats -->
    <StatsGrid
      :stats="weeklyStats"
      :current-user="currentUser"
    />

    <!-- Day Detail Modal -->
    <DayDetailModal
      :is-open="showDayModal"
      :day-data="selectedDay || {}"
      :current-user="currentUser"
      @close="closeDayModal"
      @start-workout="handleStartWorkout"
      @cancel-workout="handleCancelWorkout"
      @uncancel-workout="handleUncancelWorkout"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useUserStore } from '@/stores/userStore'
import WorkoutCard from '@/components/workout/WorkoutCard.vue'
import WeekSchedule from '@/components/workout/WeekSchedule.vue'
import StatsGrid from '@/components/common/StatsGrid.vue'
import DayDetailModal from '@/components/modals/DayDetailModal.vue'

// Props
const props = defineProps({
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Composables
const router = useRouter()
const workoutStore = useWorkoutStore()
const userStore = useUserStore()

// Reactive data
const showDayModal = ref(false)
const selectedDay = ref(null)

// Get user-specific state
const userState = computed(() => userStore.getUserState(props.currentUser))
const isWorkoutCompleted = computed(() => userState.value?.workoutCompleted || false)
const currentWeeklyStatus = computed(() => userState.value?.weeklyStatus || {})
const hasActiveWorkout = computed(() => userState.value?.activeWorkout !== null)

// Base workout data template
const baseWorkoutTemplate = {
  Monday: {
    name: 'Monday',
    workout: 'Glutes & Shoulders',
    primaryMuscles: ['Glutes', 'Hamstrings'],
    secondaryMuscles: ['Shoulders', 'Core'],
    summary: 'Great glute activation session! Romanian deadlifts, hip thrusts, and overhead press work together to build lower body strength while developing shoulder stability.',
    duration: '68 min',
    exercises: [
      { name: 'Barbell Hip Thrust', sets: 4, reps: '8-12', weight: '40-50kg' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each', weight: '15kg' },
      { name: 'Hip Abduction Machine', sets: 3, reps: '15-20', weight: 'Stack 6-8' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '12kg' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', weight: '5kg' }
    ]
  },
  Tuesday: {
    name: 'Tuesday',
    workout: 'Back & Chest',
    primaryMuscles: ['Lats', 'Rhomboids'],
    secondaryMuscles: ['Chest', 'Triceps'],
    summary: 'Balanced upper body workout focusing on posture and strength. Pull and push movements create perfect muscle balance.',
    duration: '72 min',
    exercises: [
      { name: 'Lat Pulldown', sets: 4, reps: '10-12', weight: 'Stack 7-9' },
      { name: 'Seated Cable Row', sets: 3, reps: '12-15', weight: 'Stack 6' },
      { name: 'Chest Press Machine', sets: 4, reps: '10-12', weight: '30-35kg' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', weight: '12kg' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', weight: 'Light' },
      { name: 'Push-ups', sets: 3, reps: 'To failure', weight: 'Bodyweight' }
    ]
  },
  Wednesday: {
    name: 'Wednesday',
    workout: 'Hips & Arms',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Biceps', 'Triceps'],
    summary: 'Comprehensive leg development with arm finishers. Focus on hip mobility and quad strength, then sculpt the arms.',
    exercises: [
      { name: 'Goblet Squats', sets: 4, reps: '15-20', weight: '12-15kg' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', weight: '10kg' },
      { name: 'Leg Press', sets: 4, reps: '15-20', weight: '80-100kg' },
      { name: 'Bicep Curls', sets: 3, reps: '12-15', weight: '8kg' },
      { name: 'Tricep Dips', sets: 3, reps: '10-12', weight: 'Bodyweight' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', weight: '6kg' }
    ]
  },
  Thursday: {
    name: 'Thursday',
    workout: 'Chest & Back',
    primaryMuscles: ['Chest', 'Lats'],
    secondaryMuscles: ['Shoulders', 'Core'],
    summary: 'Upper body strength focus with compound movements. Build pressing power and pulling strength in one session.',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: '25-30kg' },
      { name: 'Bent Over Row', sets: 4, reps: '10-12', weight: '20kg' },
      { name: 'Incline Flyes', sets: 3, reps: '12-15', weight: '8kg' },
      { name: 'Pull-ups (Assisted)', sets: 3, reps: '6-8', weight: 'Assisted' },
      { name: 'Cable Crossover', sets: 3, reps: '12-15', weight: 'Stack 4' }
    ]
  },
  Friday: {
    name: 'Friday',
    workout: 'Full Body Mix',
    primaryMuscles: ['Full Body'],
    secondaryMuscles: ['Core', 'Stabilizers'],
    summary: 'Multi-joint movements for overall strength and conditioning. Perfect end-of-week session combining all muscle groups.',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', weight: '40-50kg' },
      { name: 'Push-ups', sets: 3, reps: 'To failure', weight: 'Bodyweight' },
      { name: 'Squats', sets: 3, reps: '12-15', weight: '20kg' },
      { name: 'Plank', sets: 3, reps: '60 seconds', weight: 'Bodyweight' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', weight: 'Bodyweight' }
    ]
  },
  Saturday: {
    name: 'Saturday',
    workout: 'Core & Cardio',
    primaryMuscles: ['Core', 'Abs'],
    secondaryMuscles: ['Hip Flexors', 'Obliques'],
    summary: 'Active recovery with core strengthening and mobility work. Light session to prepare for next week.',
    exercises: [
      { name: 'Russian Twists', sets: 3, reps: '20 each', weight: '5kg plate' },
      { name: 'Bicycle Crunches', sets: 3, reps: '30 seconds', weight: 'Bodyweight' },
      { name: 'Treadmill Walk', sets: 1, reps: '20 minutes', weight: 'Moderate pace' },
      { name: 'Stretching', sets: 1, reps: '15 minutes', weight: 'Full body' }
    ]
  },
  Sunday: {
    name: 'Sunday',
    workout: 'Rest Day',
    primaryMuscles: [],
    secondaryMuscles: [],
    summary: 'Complete rest for muscle recovery and growth. Use this time for meal prep and relaxation.',
    exercises: []
  }
}

// Dynamic week days that sync with specific user's state
const dynamicWeekDays = computed(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  
  return Object.entries(baseWorkoutTemplate).map(([dayName, dayData]) => {
    // Get status from specific user's state, with smart defaults
    let status = currentWeeklyStatus.value[dayName] || 'planned'
    
    // Override status based on actual workout completion for this specific user
    if (dayName === today) {
      if (isWorkoutCompleted.value) {
        status = 'completed'
        // Update the store to keep it in sync for this specific user
        if (currentWeeklyStatus.value[dayName] !== 'completed') {
          userStore.updateWeeklyStatus(props.currentUser, dayName, 'completed')
        }
      } else if (hasActiveWorkout.value) {
        status = 'active'
      } else {
        status = 'today'
      }
    }
    
    // Add completion data if completed for this specific user
    let completionData = {}
    if (status === 'completed' && userState.value?.lastWorkout) {
      completionData = {
        progress: '100%',
        completedSets: `${userState.value.lastWorkout.totalSets || 0}/${userState.value.lastWorkout.totalSets || 0}`,
        actualDuration: userState.value.sessionDuration || dayData.duration
      }
    }
    
    return {
      ...dayData,
      status,
      ...completionData,
      isToday: dayName === today,
      canStart: dayName === today && !isWorkoutCompleted.value && !hasActiveWorkout.value
    }
  })
})

const weeklyStats = computed(() => {
  const completedDays = dynamicWeekDays.value.filter(day => day.status === 'completed').length
  const workoutDays = dynamicWeekDays.value.filter(day => day.name !== 'Sunday').length
  const weeklyProgress = Math.round((completedDays / workoutDays) * 100)

  return [
    { 
      id: 'completed', 
      value: `${completedDays}/${workoutDays}`, 
      label: 'Completed', 
      icon: '✅' 
    },
    { 
      id: 'progress', 
      value: `${weeklyProgress}%`, 
      label: 'Progress', 
      icon: '📈' 
    }
  ]
})

// Computed styles
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

// Methods
const getUserName = () => {
  return props.currentUser === 'A' ? 'User A (Muscle Building)' : 'User B (Weight Loss)'
}

const handleDayClick = (day) => {
  selectedDay.value = day
  showDayModal.value = true
}

const closeDayModal = () => {
  showDayModal.value = false
  selectedDay.value = null
}

const handleStartWorkout = (dayData) => {
  // Check if workout is already completed for this specific user
  if (dayData.status === 'completed') {
    alert(`🎉 You have already completed this workout! Great job!`)
    closeDayModal()
    return
  }
  
  // Check if it's not today
  if (!dayData.isToday) {
    alert(`⏰ You can only start today's workout. Come back on ${dayData.name}!`)
    closeDayModal()
    return
  }
  
  // Check if there's already an active workout for this specific user
  if (hasActiveWorkout.value) {
    alert(`🏋️‍♀️ You already have an active workout. Finish it first!`)
    closeDayModal()
    return
  }
  
  // Start the workout for this specific user
  const todaysWorkout = workoutStore.getCurrentUserWorkout(props.currentUser)
  if (todaysWorkout) {
    workoutStore.startWorkout(props.currentUser, todaysWorkout)
  }
  
  // Close modal and navigate to today view
  closeDayModal()
  router.push('/')
}

const handleCancelWorkout = (dayData) => {
  // Update the user store with cancellation for this specific user
  userStore.updateWeeklyStatus(props.currentUser, dayData.name, 'cancelled')
  
  // Close modal
  closeDayModal()
}

const handleUncancelWorkout = (dayData) => {
  // Determine what status to restore to
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const newStatus = dayData.name === today ? 'today' : 'planned'
  
  // Update the user store with uncancellation for this specific user
  userStore.updateWeeklyStatus(props.currentUser, dayData.name, newStatus)
  
  // Close modal
  closeDayModal()
}
</script>