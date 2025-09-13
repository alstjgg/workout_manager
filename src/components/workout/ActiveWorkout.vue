<template>
  <!-- Loading State -->
  <div v-if="!activeWorkout" :style="loadingContainerStyles">
    <div :style="loadingSpinnerStyles">⏳</div>
    <div :style="loadingTextStyles">Loading workout...</div>
  </div>

  <!-- Active Workout Content -->
  <div v-else :style="activeWorkoutStyles">
    <!-- Timer Display at Top -->
    <div :style="timerDisplayStyles">
      <div :style="timerSectionStyles">
        <div :style="currentTimerStyles">
          <div :style="timerLabelStyles">Timer</div>
          <div :style="timerValueStyles">{{ workoutStore.getCurrentTimerDisplay(props.currentUser) }}</div>
        </div>
        <div :style="totalTimerStyles">
          <div :style="timerLabelStyles">Total Time</div>
          <div :style="timerValueStyles">{{ workoutStore.getTotalWorkoutTime(props.currentUser) }}</div>
        </div>
      </div>
      <div :style="timerStatusStyles">
        <span :style="getTimerStatusStyle()">{{ getTimerStatusText() }}</span>
      </div>
    </div>

    <!-- Workout Header -->
    <div :style="workoutHeaderStyles">
      <div>
        <h2 :style="workoutTitleStyles">{{ activeWorkout.title }}</h2>
        <p :style="workoutDescriptionStyles">{{ activeWorkout.description }}</p>
      </div>
      <div :style="workoutStatsStyles">
        <div :style="statItemStyles">
          <div :style="getProgressValueStyle()">{{ workoutProgress }}%</div>
          <div :style="statLabelStyles">Progress</div>
        </div>
        <div :style="statItemStyles">
          <div :style="statValueStyles">{{ completedSets }}/{{ totalSets }}</div>
          <div :style="statLabelStyles">Sets</div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div :style="progressBarContainerStyles">
      <div :style="progressBarStyles">
        <div :style="getProgressBarFillStyle()"></div>
      </div>
      <div :style="progressTextStyles">
        {{ completedSets }}/{{ totalSets }} sets completed
      </div>
    </div>

    <!-- Current Exercise -->
    <div :style="currentExerciseSectionStyles">
      <div :style="sectionHeaderStyles">
        <h3 :style="sectionTitleStyles">Current Exercise</h3>
        <div :style="exerciseCounterStyles">
          {{ currentExerciseIndex + 1 }}/{{ activeWorkout.exercises.length }}
        </div>
      </div>

      <ExerciseTracker
        v-if="currentExercise"
        :exercise="currentExercise"
        :current-user="props.currentUser"
      />
      <div v-else :style="exerciseLoadingStyles">
        Loading exercise...
      </div>

      <!-- Exercise Navigation -->
      <div :style="exerciseNavigationStyles">
        <button
          @click="previousExercise"
          :disabled="currentExerciseIndex === 0"
          :style="getNavButtonStyle('prev')"
        >
          ← Previous
        </button>
        <button
          @click="nextExercise"
          :disabled="currentExerciseIndex >= activeWorkout.exercises.length - 1"
          :style="getNavButtonStyle('next')"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- All Exercises Overview -->
    <div :style="allExercisesSectionStyles">
      <div :style="sectionHeaderStyles">
        <h3 :style="sectionTitleStyles">Workout Overview</h3>
        <button
          @click="showAllExercises = !showAllExercises"
          :style="toggleButtonStyles"
        >
          {{ showAllExercises ? '▼ Hide' : '▶ Show' }}
        </button>
      </div>

      <div v-if="showAllExercises" :style="exercisesListStyles">
        <div
          v-for="(exercise, index) in activeWorkout.exercises"
          :key="exercise.id"
          :style="getExerciseItemStyle(index)"
          @click="currentExerciseIndex = index"
        >
          <div :style="exerciseItemHeaderStyles">
            <div :style="exerciseItemNameStyles">{{ exercise.name }}</div>
            <div :style="getExerciseProgressStyle(exercise)">
              {{ getExerciseCompletedSets(exercise) }}/{{ exercise.sets }}
            </div>
          </div>
          <div :style="exerciseItemDetailsStyles">
            {{ exercise.reps }} • {{ exercise.weight }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div :style="actionButtonsStyles">
      <button
        @click="pauseWorkout"
        :style="pauseButtonStyles"
      >
        ⏸️ Pause Workout
      </button>
      <button
        @click="showFinishModal = true"
        :style="getFinishButtonStyle()"
      >
        🏁 Finish Workout
      </button>
    </div>

    <!-- Simple Finish Modal -->
    <div v-if="showFinishModal" :style="modalOverlayStyles" @click="showFinishModal = false">
      <div :style="modalContentStyles" @click.stop>
        <div :style="modalHeaderStyles">
          <h3 :style="modalTitleStyles">Finish Workout</h3>
          <button @click="showFinishModal = false" :style="closeButtonStyles">✕</button>
        </div>
        
        <div :style="modalBodyStyles">
          <div :style="workoutSummaryStyles">
            <h4 :style="summaryTitleStyles">Workout Summary</h4>
            <div :style="summaryStatsStyles">
              <div>Total Time: {{ workoutStore.getTotalWorkoutTime(props.currentUser) }}</div>
              <div>Progress: {{ workoutProgress }}% ({{ completedSets }}/{{ totalSets }} sets)</div>
              <div>Exercises: {{ activeWorkout.exercises.length }}</div>
            </div>
          </div>
          
          <div :style="notesContainerStyles">
            <label :style="notesLabelStyles">Session Notes (Optional):</label>
            <textarea
              v-model="sessionNotes"
              :style="notesTextareaStyles"
              placeholder="How did the workout feel? Any achievements or challenges?"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div :style="modalFooterStyles">
          <button @click="showFinishModal = false" :style="cancelButtonStyles">
            Cancel
          </button>
          <button @click="finishWorkout" :style="getConfirmButtonStyle()">
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'
import ExerciseTracker from './ExerciseTracker.vue'

// Props
const props = defineProps({
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
const emit = defineEmits(['workoutFinished', 'workoutPaused'])

// Store
const workoutStore = useWorkoutStore()

// Reactive data
const showAllExercises = ref(false)
const showFinishModal = ref(false)
const sessionNotes = ref('')
const currentExerciseIndex = ref(0)

// FIXED: Get user-specific active workout instead of global activeWorkout
const activeWorkout = computed(() => {
  const userState = workoutStore.getCurrentUserState(props.currentUser)
  return userState?.activeWorkout
})

const userState = computed(() => workoutStore.getCurrentUserState(props.currentUser))
const workoutProgress = computed(() => workoutStore.getWorkoutProgress(props.currentUser))

const currentExercise = computed(() => {
  if (!activeWorkout.value || !activeWorkout.value.exercises) return null
  return activeWorkout.value.exercises[currentExerciseIndex.value]
})

const completedSets = computed(() => userState.value?.completedSets || 0)
const totalSets = computed(() => userState.value?.totalSets || 0)

// Watch for activeWorkout changes to reset exercise index
watch(activeWorkout, (newWorkout) => {
  if (newWorkout && newWorkout.exercises) {
    currentExerciseIndex.value = 0
    console.log(`🏋️‍♀️ ActiveWorkout: User ${props.currentUser} workout loaded:`, newWorkout.title)
  }
}, { immediate: true })

// Computed styles
const loadingContainerStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}))

const loadingSpinnerStyles = computed(() => ({
  fontSize: '48px',
  marginBottom: '16px'
}))

const loadingTextStyles = computed(() => ({
  fontSize: '18px',
  color: '#6b7280',
  fontWeight: '500'
}))

const activeWorkoutStyles = computed(() => ({
  display: 'flex', 
  flexDirection: 'column', 
  gap: '24px', 
  maxWidth: '800px', 
  margin: '0 auto'
}))

const timerDisplayStyles = computed(() => ({
  backgroundColor: 'white', 
  padding: '20px', 
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  border: '2px solid ' + (props.currentUser === 'A' ? '#8b5cf6' : '#ec4899'),
  position: 'sticky', 
  top: '80px', 
  zIndex: '40'
}))

const timerSectionStyles = computed(() => ({
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '20px', 
  marginBottom: '12px'
}))

const currentTimerStyles = computed(() => ({ textAlign: 'center' }))
const totalTimerStyles = computed(() => ({ textAlign: 'center' }))

const timerLabelStyles = computed(() => ({
  fontSize: '14px', 
  fontWeight: '600', 
  color: '#6b7280', 
  marginBottom: '4px'
}))

const timerValueStyles = computed(() => ({
  fontSize: '32px', 
  fontWeight: 'bold',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  fontFamily: 'Monaco, monospace'
}))

const timerStatusStyles = computed(() => ({ textAlign: 'center' }))

const workoutHeaderStyles = computed(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  backgroundColor: 'white', 
  padding: '24px', 
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
  border: '1px solid #e5e7eb'
}))

const workoutTitleStyles = computed(() => ({
  fontSize: '24px', 
  fontWeight: 'bold', 
  color: '#111827', 
  margin: '0 0 8px 0'
}))

const workoutDescriptionStyles = computed(() => ({ 
  fontSize: '16px', 
  color: '#6b7280', 
  margin: '0' 
}))

const workoutStatsStyles = computed(() => ({ 
  display: 'flex', 
  gap: '24px' 
}))

const statItemStyles = computed(() => ({ 
  textAlign: 'center' 
}))

const statValueStyles = computed(() => ({ 
  fontSize: '20px', 
  fontWeight: 'bold', 
  color: '#111827' 
}))

const statLabelStyles = computed(() => ({ 
  fontSize: '14px', 
  color: '#6b7280' 
}))

const progressBarContainerStyles = computed(() => ({
  backgroundColor: 'white', 
  padding: '20px', 
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
  border: '1px solid #e5e7eb'
}))

const progressBarStyles = computed(() => ({
  width: '100%', 
  height: '12px', 
  backgroundColor: '#e5e7eb',
  borderRadius: '6px', 
  overflow: 'hidden', 
  marginBottom: '12px'
}))

const progressTextStyles = computed(() => ({
  fontSize: '14px', 
  color: '#6b7280', 
  textAlign: 'center'
}))

const currentExerciseSectionStyles = computed(() => ({
  backgroundColor: 'white', 
  padding: '24px', 
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
  border: '1px solid #e5e7eb'
}))

const sectionHeaderStyles = computed(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '20px'
}))

const sectionTitleStyles = computed(() => ({
  fontSize: '18px', 
  fontWeight: '600', 
  color: '#111827', 
  margin: '0'
}))

const exerciseCounterStyles = computed(() => ({
  fontSize: '14px', 
  fontWeight: '500',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  backgroundColor: props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8',
  padding: '6px 12px', 
  borderRadius: '12px'
}))

const exerciseLoadingStyles = computed(() => ({
  padding: '40px', 
  textAlign: 'center', 
  fontSize: '16px',
  color: '#6b7280', 
  fontStyle: 'italic'
}))

const exerciseNavigationStyles = computed(() => ({
  display: 'flex', 
  gap: '12px', 
  marginTop: '20px'
}))

const allExercisesSectionStyles = computed(() => ({
  backgroundColor: 'white', 
  padding: '24px', 
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
  border: '1px solid #e5e7eb'
}))

const toggleButtonStyles = computed(() => ({
  fontSize: '14px', 
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  backgroundColor: 'transparent', 
  border: 'none', 
  cursor: 'pointer', 
  fontWeight: '500'
}))

const exercisesListStyles = computed(() => ({
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px', 
  marginTop: '16px'
}))

const exerciseItemHeaderStyles = computed(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '4px'
}))

const exerciseItemNameStyles = computed(() => ({
  fontSize: '16px', 
  fontWeight: '600', 
  color: '#111827'
}))

const exerciseItemDetailsStyles = computed(() => ({ 
  fontSize: '14px', 
  color: '#6b7280' 
}))

const actionButtonsStyles = computed(() => ({
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '16px', 
  position: 'sticky', 
  bottom: '24px'
}))

const pauseButtonStyles = computed(() => ({
  padding: '16px', 
  backgroundColor: '#f59e0b', 
  color: 'white', 
  border: 'none',
  borderRadius: '12px', 
  fontSize: '16px', 
  fontWeight: '600', 
  cursor: 'pointer',
  transition: 'all 0.2s', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}))

// Modal styles
const modalOverlayStyles = computed(() => ({
  position: 'fixed', 
  inset: '0', 
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: '50', 
  padding: '16px'
}))

const modalContentStyles = computed(() => ({
  backgroundColor: 'white', 
  borderRadius: '12px', 
  maxWidth: '500px', 
  width: '100%',
  maxHeight: '90vh', 
  overflow: 'hidden', 
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
}))

const modalHeaderStyles = computed(() => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: '24px', 
  borderBottom: '1px solid #e5e7eb'
}))

const modalTitleStyles = computed(() => ({
  fontSize: '18px', 
  fontWeight: '600', 
  color: '#111827', 
  margin: '0'
}))

const closeButtonStyles = computed(() => ({
  backgroundColor: 'transparent', 
  border: 'none', 
  fontSize: '20px',
  color: '#6b7280', 
  cursor: 'pointer', 
  padding: '4px'
}))

const modalBodyStyles = computed(() => ({
  padding: '24px', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '20px'
}))

const workoutSummaryStyles = computed(() => ({
  padding: '16px', 
  backgroundColor: '#f9fafb', 
  borderRadius: '8px'
}))

const summaryTitleStyles = computed(() => ({
  fontSize: '16px', 
  fontWeight: '600', 
  color: '#111827', 
  margin: '0 0 12px 0'
}))

const summaryStatsStyles = computed(() => ({
  display: 'flex', 
  flexDirection: 'column', 
  gap: '4px', 
  fontSize: '14px', 
  color: '#6b7280'
}))

const notesContainerStyles = computed(() => ({
  display: 'flex', 
  flexDirection: 'column', 
  gap: '8px'
}))

const notesLabelStyles = computed(() => ({
  fontSize: '14px', 
  fontWeight: '500', 
  color: '#111827'
}))

const notesTextareaStyles = computed(() => ({
  padding: '12px', 
  border: '1px solid #d1d5db', 
  borderRadius: '8px',
  fontSize: '14px', 
  fontFamily: 'inherit', 
  resize: 'vertical'
}))

const modalFooterStyles = computed(() => ({
  padding: '24px', 
  borderTop: '1px solid #e5e7eb', 
  display: 'flex', 
  gap: '12px'
}))

const cancelButtonStyles = computed(() => ({
  flex: '1', 
  padding: '12px', 
  backgroundColor: 'transparent',
  border: '1px solid #d1d5db', 
  borderRadius: '8px', 
  fontSize: '14px',
  fontWeight: '500', 
  color: '#374151', 
  cursor: 'pointer', 
  transition: 'all 0.2s'
}))

// Methods
const previousExercise = () => {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
    console.log(`👈 ActiveWorkout: User ${props.currentUser} moved to exercise ${currentExerciseIndex.value + 1}`)
  }
}

const nextExercise = () => {
  if (activeWorkout.value && currentExerciseIndex.value < activeWorkout.value.exercises.length - 1) {
    currentExerciseIndex.value++
    console.log(`👉 ActiveWorkout: User ${props.currentUser} moved to exercise ${currentExerciseIndex.value + 1}`)
  }
}

const pauseWorkout = () => {
  console.log(`⏸️ ActiveWorkout: User ${props.currentUser} pausing workout`)
  workoutStore.pauseWorkout(props.currentUser)
  emit('workoutPaused')
}

const finishWorkout = () => {
  console.log(`🏁 ActiveWorkout: User ${props.currentUser} finishing workout`)
  workoutStore.completeWorkout(props.currentUser, sessionNotes.value)
  showFinishModal.value = false
  emit('workoutFinished')
}

const getExerciseCompletedSets = (exercise) => {
  let count = 0
  for (let i = 0; i < exercise.sets; i++) {
    if (workoutStore.isSetCompleted(props.currentUser, exercise.id, i)) {
      count++
    }
  }
  return count
}

const getTimerStatusText = () => {
  const status = workoutStore.getTimerStatus(props.currentUser)
  return `● ${status}`
}

const getTimerStatusStyle = () => {
  const status = workoutStore.getTimerStatus(props.currentUser)
  let color = '#6b7280' // READY
  
  if (status === 'SET') color = '#10b981' // Green
  if (status === 'REST') color = '#f59e0b' // Orange
  
  return {
    fontSize: '14px',
    fontWeight: '600',
    color: color
  }
}

const getProgressValueStyle = () => ({
  fontSize: '20px', 
  fontWeight: 'bold',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777'
})

const getProgressBarFillStyle = () => ({
  width: `${workoutProgress.value}%`, 
  height: '100%',
  background: props.currentUser === 'A' 
    ? 'linear-gradient(to right, #a78bfa, #8b5cf6)'
    : 'linear-gradient(to right, #f472b6, #ec4899)',
  transition: 'width 0.3s ease-out'
})

const getNavButtonStyle = (type) => {
  const isDisabled = type === 'prev' 
    ? currentExerciseIndex.value === 0
    : !activeWorkout.value || currentExerciseIndex.value >= activeWorkout.value.exercises.length - 1

  return {
    flex: '1', 
    padding: '12px',
    backgroundColor: isDisabled ? '#f3f4f6' : (props.currentUser === 'A' ? '#8b5cf6' : '#ec4899'),
    color: isDisabled ? '#9ca3af' : 'white', 
    border: 'none', 
    borderRadius: '8px',
    fontSize: '14px', 
    fontWeight: '500',
    cursor: isDisabled ? 'not-allowed' : 'pointer', 
    transition: 'all 0.2s'
  }
}

const getExerciseItemStyle = (index) => ({
  padding: '16px', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  transition: 'all 0.2s',
  backgroundColor: index === currentExerciseIndex.value 
    ? (props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8') : '#f9fafb',
  border: index === currentExerciseIndex.value
    ? `2px solid ${props.currentUser === 'A' ? '#8b5cf6' : '#ec4899'}` : '1px solid #e5e7eb'
})

const getExerciseProgressStyle = (exercise) => {
  const completed = getExerciseCompletedSets(exercise)
  const isComplete = completed === exercise.sets
  
  return {
    fontSize: '14px', 
    fontWeight: '600',
    color: isComplete ? '#059669' : '#6b7280',
    backgroundColor: isComplete ? '#d1fae5' : '#f3f4f6',
    padding: '4px 8px', 
    borderRadius: '12px'
  }
}

const getFinishButtonStyle = () => ({
  padding: '16px',
  background: props.currentUser === 'A' 
    ? 'linear-gradient(to right, #8b5cf6, #7c3aed)'
    : 'linear-gradient(to right, #ec4899, #db2777)',
  color: 'white', 
  border: 'none', 
  borderRadius: '12px',
  fontSize: '16px', 
  fontWeight: '600', 
  cursor: 'pointer',
  transition: 'all 0.2s', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
})

const getConfirmButtonStyle = () => ({
  flex: '1', 
  padding: '12px',
  backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
  color: 'white', 
  border: 'none', 
  borderRadius: '8px',
  fontSize: '14px', 
  fontWeight: '500', 
  cursor: 'pointer', 
  transition: 'all 0.2s'
})
</script>