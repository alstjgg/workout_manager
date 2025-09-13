<template>
  <div v-if="isOpen" :style="modalOverlayStyles" @click="closeModal">
    <div :style="modalContentStyles" @click.stop>
      <!-- Modal Header -->
      <div :style="modalHeaderStyles">
        <div>
          <h3 :style="modalTitleStyles">{{ dayData.name }}</h3>
          <p :style="modalSubtitleStyles">{{ dayData.workout }}</p>
        </div>
        <button @click="closeModal" :style="closeButtonStyles">✕</button>
      </div>

      <!-- Modal Body -->
      <div :style="modalBodyStyles">
        <!-- Focus Areas -->
        <div :style="focusAreasSectionStyles">
          <h4 :style="sectionTitleStyles">Focus Areas</h4>
          <div :style="focusAreasGridStyles">
            <div :style="focusItemStyles">
              <span :style="focusLabelStyles">Primary:</span>
              <span>{{ dayData.primaryMuscles?.join(', ') || 'Full Body' }}</span>
            </div>
            <div :style="focusItemStyles">
              <span :style="focusLabelStyles">Secondary:</span>
              <span>{{ dayData.secondaryMuscles?.join(', ') || 'Core' }}</span>
            </div>
          </div>
        </div>

        <!-- Workout Summary -->
        <div :style="summarySectionStyles">
          <h4 :style="sectionTitleStyles">Summary</h4>
          <p :style="summaryTextStyles">{{ dayData.summary }}</p>
        </div>

        <!-- Exercise List (for completed/today workouts) -->
        <div v-if="dayData.status !== 'rest'" :style="exercisesSectionStyles">
          <h4 :style="sectionTitleStyles">
            {{ dayData.status === 'completed' ? 'Completed Exercises' : 'Planned Exercises' }}
          </h4>
          <div :style="exercisesListStyles">
            <div 
              v-for="(exercise, index) in dayData.exercises" 
              :key="index"
              :style="exerciseItemStyles"
            >
              <div :style="exerciseNumberStyles">{{ index + 1 }}</div>
              <div :style="exerciseDetailsStyles">
                <div :style="exerciseNameStyles">{{ exercise.name }}</div>
                <div :style="exerciseSpecsStyles">
                  {{ exercise.sets }} sets • {{ exercise.reps }} • {{ exercise.weight }}
                </div>
              </div>
              <div v-if="dayData.status === 'completed'" :style="completedBadgeStyles">✓</div>
            </div>
          </div>
        </div>

        <!-- Completion Summary (for completed workouts) -->
        <div v-if="dayData.status === 'completed'" :style="completionSummaryStyles">
          <div :style="completionStatStyles">
            <span :style="statLabelStyles">Duration:</span>
            <span :style="statValueStyles">{{ dayData.duration || '65 min' }}</span>
          </div>
          <div :style="completionStatStyles">
            <span :style="statLabelStyles">Progress:</span>
            <span :style="statValueStyles">{{ dayData.progress || '100%' }}</span>
          </div>
          <div :style="completionStatStyles">
            <span :style="statLabelStyles">Sets Completed:</span>
            <span :style="statValueStyles">{{ dayData.completedSets || '18/18' }}</span>
          </div>
        </div>

        <!-- Cancellation Summary (for cancelled workouts) -->
        <div v-if="dayData.status === 'cancelled'" :style="cancellationSummaryStyles">
          <div :style="cancellationHeaderStyles">
            <span :style="cancellationIconStyles">❌</span>
            <span :style="cancellationTitleStyles">Workout Cancelled</span>
          </div>
          <div :style="cancellationMessageStyles">
            {{ getCancellationMessage() }}
          </div>
          <div :style="recoveryTipStyles">
            <span :style="recoveryTipLabelStyles">💡 Recovery Tip:</span>
            <span :style="recoveryTipTextStyles">{{ getRecoveryTip() }}</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div :style="modalFooterStyles">
        <!-- Today workout - Start button -->
        <div v-if="dayData.status === 'today'" :style="actionButtonsStyles">
          <button @click="closeModal" :style="cancelButtonStyles">
            Close
          </button>
          <button @click="startTodaysWorkout" :style="getStartButtonStyle()">
            Start Today's Workout
          </button>
        </div>

        <!-- Planned workout - Cancel option -->
        <div v-else-if="dayData.status === 'planned'" :style="actionButtonsStyles">
          <button @click="cancelWorkout" :style="cancelWorkoutButtonStyles">
            Cancel Day
          </button>
          <button @click="closeModal" :style="closeOnlyButtonStyles">
            Close
          </button>
        </div>

        <!-- Cancelled workout - Uncancel option -->
        <div v-else-if="dayData.status === 'cancelled'" :style="actionButtonsStyles">
          <button @click="uncancelWorkout" :style="uncancelButtonStyles">
            🔄 Uncancel Day
          </button>
          <button @click="closeModal" :style="cancelButtonStyles">
            Close
          </button>
        </div>

        <!-- Completed/Rest - Close only -->
        <div v-else :style="actionButtonsStyles">
          <button @click="closeModal" :style="closeOnlyButtonStyles">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  dayData: {
    type: Object,
    required: true
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
const emit = defineEmits(['close', 'start-workout', 'cancel-workout', 'uncancel-workout'])

// Methods
const closeModal = () => {
  emit('close')
}

const startTodaysWorkout = () => {
  emit('start-workout', props.dayData)
  closeModal()
}

const cancelWorkout = () => {
  emit('cancel-workout', props.dayData)
  closeModal()
}

const uncancelWorkout = () => {
  emit('uncancel-workout', props.dayData)
  closeModal()
}

const getCancellationMessage = () => {
  return `This ${props.dayData.name} workout was cancelled. Sometimes rest is part of the process!`
}

const getRecoveryTip = () => {
  const tips = {
    A: "Use this time for gentle stretching or mobility work to support muscle growth.",
    B: "Stay hydrated and plan a nutritious meal to support your goals."
  }
  return tips[props.currentUser] || tips.A
}

// Computed styles
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
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column'
}))

const modalHeaderStyles = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '24px',
  borderBottom: '1px solid #e5e7eb'
}))

const modalTitleStyles = computed(() => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 4px 0'
}))

const modalSubtitleStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280',
  margin: '0'
}))

const closeButtonStyles = computed(() => ({
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '20px',
  color: '#6b7280',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px'
}))

const modalBodyStyles = computed(() => ({
  padding: '24px',
  overflow: 'auto',
  flex: '1'
}))

const focusAreasSectionStyles = computed(() => ({
  marginBottom: '24px'
}))

const sectionTitleStyles = computed(() => ({
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 12px 0'
}))

const focusAreasGridStyles = computed(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '8px'
}))

const focusItemStyles = computed(() => ({
  display: 'flex',
  fontSize: '14px'
}))

const focusLabelStyles = computed(() => ({
  fontWeight: '600',
  color: '#374151',
  width: '80px',
  flexShrink: '0'
}))

const summarySectionStyles = computed(() => ({
  marginBottom: '24px'
}))

const summaryTextStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '0'
}))

const exercisesSectionStyles = computed(() => ({
  marginBottom: '24px'
}))

const exercisesListStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}))

const exerciseItemStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
}))

const exerciseNumberStyles = computed(() => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0'
}))

const exerciseDetailsStyles = computed(() => ({
  flex: '1'
}))

const exerciseNameStyles = computed(() => ({
  fontSize: '14px',
  fontWeight: '500',
  color: '#111827'
}))

const exerciseSpecsStyles = computed(() => ({
  fontSize: '12px',
  color: '#6b7280'
}))

const completedBadgeStyles = computed(() => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#10b981',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const completionSummaryStyles = computed(() => ({
  padding: '16px',
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  border: '1px solid #d1fae5',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}))

const completionStatStyles = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px'
}))

const statLabelStyles = computed(() => ({
  color: '#065f46',
  fontWeight: '500'
}))

const statValueStyles = computed(() => ({
  color: '#047857',
  fontWeight: '600'
}))

const modalFooterStyles = computed(() => ({
  padding: '24px',
  borderTop: '1px solid #e5e7eb'
}))

const actionButtonsStyles = computed(() => ({
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

const getStartButtonStyle = () => ({
  flex: '1',
  padding: '12px',
  backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s'
})

const cancelWorkoutButtonStyles = computed(() => ({
  flex: '1',
  padding: '12px',
  backgroundColor: 'transparent',
  border: '1px solid #ef4444',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#ef4444',
  cursor: 'pointer',
  transition: 'all 0.2s'
}))

const closeOnlyButtonStyles = computed(() => ({
  flex: '1',
  padding: '12px',
  backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s'
}))

const uncancelButtonStyles = computed(() => ({
  flex: '1',
  padding: '12px',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
}))

// Cancellation styles
const cancellationSummaryStyles = computed(() => ({
  padding: '16px',
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}))

const cancellationHeaderStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}))

const cancellationIconStyles = computed(() => ({
  fontSize: '20px'
}))

const cancellationTitleStyles = computed(() => ({
  fontSize: '16px',
  fontWeight: '600',
  color: '#dc2626'
}))

const cancellationMessageStyles = computed(() => ({
  fontSize: '14px',
  color: '#991b1b',
  lineHeight: '1.4'
}))

const recoveryTipStyles = computed(() => ({
  padding: '12px',
  backgroundColor: '#f0f9ff',
  borderRadius: '6px',
  border: '1px solid #bae6fd',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
}))

const recoveryTipLabelStyles = computed(() => ({
  fontSize: '13px',
  fontWeight: '600',
  color: '#0369a1'
}))

const recoveryTipTextStyles = computed(() => ({
  fontSize: '13px',
  color: '#075985',
  lineHeight: '1.4'
}))
</script>