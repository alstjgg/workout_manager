<template>
  <div :style="workoutCardStyles">
    <div :style="cardPaddingStyles">
      <div :style="cardHeaderStyles">
        <div>
          <h3 :style="cardTitleStyles">{{ title }}</h3>
          <p v-if="subtitle" :style="cardSubtitleStyles">{{ subtitle }}</p>
        </div>
        <div v-if="badge" :style="badgeStyles">
          {{ badge }}
        </div>
      </div>

      <!-- Workout Details -->
      <div v-if="showDetails && workout" :style="workoutDetailsStyles">
        <h4 :style="workoutTitleStyles">{{ workout.title }}</h4>
        
        <div :style="statsGridStyles">
          <div :style="statItemStyles">
            <div :style="statNumberStyles">{{ workout.duration }}</div>
            <div :style="statLabelStyles">Duration</div>
          </div>
          <div :style="statItemStyles">
            <div :style="statNumberStyles">{{ getExerciseCount() }}</div>
            <div :style="statLabelStyles">Exercises</div>
          </div>
        </div>
      </div>

      <!-- Focus Areas -->
      <div v-if="focusAreas?.length" :style="focusAreaStyles">
        <h5 :style="focusLabelStyles">Today's Focus</h5>
        <div :style="focusTagsStyles">
          <span 
            v-for="focus in focusAreas"
            :key="focus"
            :style="getFocusTagStyle()"
          >
            {{ focus }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <button 
        v-if="showStartButton"
        @click="handleStartWorkout"
        :style="getStartButtonStyle()"
        @mouseover="hoveredButton = 'start'"
        @mouseleave="hoveredButton = null"
      >
        <div :style="buttonContentCenterStyles">
          <span style="font-size: 20px; margin-right: 8px;">▶️</span>
          <span>{{ buttonText }}</span>
        </div>
      </button>

      <!-- Slot for custom content -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  workout: {
    type: Object,
    default: () => ({})
  },
  focusAreas: {
    type: Array,
    default: () => []
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  showStartButton: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Start Today\'s Workout'
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
const emit = defineEmits(['startWorkout'])

// Reactive data
const hoveredButton = ref(null)

// Methods
const handleStartWorkout = () => {
  emit('startWorkout', props.workout)
}

const getExerciseCount = () => {
  if (!props.workout || !props.workout.exercises) return 0
  return props.workout.exercises.length
}

// Computed styles
const workoutCardStyles = computed(() => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid #f3f4f6',
  overflow: 'hidden'
}))

const cardPaddingStyles = computed(() => ({ 
  padding: '24px' 
}))

const cardHeaderStyles = computed(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: props.showDetails || props.focusAreas?.length || props.showStartButton ? '24px' : '0'
}))

const cardTitleStyles = computed(() => ({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 8px 0'
}))

const cardSubtitleStyles = computed(() => ({ 
  color: '#6b7280', 
  margin: '0' 
}))

const badgeStyles = computed(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: '#dbeafe',
  color: '#1e40af'
}))

const workoutDetailsStyles = computed(() => ({
  background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px'
}))

const workoutTitleStyles = computed(() => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#111827',
  margin: '0 0 16px 0'
}))

const statsGridStyles = computed(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px'
}))

const statItemStyles = computed(() => ({ 
  textAlign: 'center' 
}))

const statNumberStyles = computed(() => ({
  fontSize: '30px',
  fontWeight: 'bold',
  color: '#111827'
}))

const statLabelStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '500'
}))

const focusAreaStyles = computed(() => ({ 
  marginBottom: '24px' 
}))

const focusLabelStyles = computed(() => ({
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 12px 0'
}))

const focusTagsStyles = computed(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px'
}))

const buttonContentCenterStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const getFocusTagStyle = () => ({
  padding: '6px 12px',
  borderRadius: '9999px',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8',
  color: props.currentUser === 'A' ? '#7c3aed' : '#be185d',
  border: props.currentUser === 'A' ? '1px solid #c4b5fd' : '1px solid #f9a8d4'
})

const getStartButtonStyle = () => ({
  width: '100%',
  padding: '16px',
  color: 'white',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '18px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: props.currentUser === 'A' 
    ? (hoveredButton.value === 'start' ? 'linear-gradient(to right, #7c3aed, #6d28d9)' : 'linear-gradient(to right, #8b5cf6, #7c3aed)')
    : (hoveredButton.value === 'start' ? 'linear-gradient(to right, #db2777, #be185d)' : 'linear-gradient(to right, #ec4899, #db2777)'),
  transform: hoveredButton.value === 'start' ? 'scale(1.02)' : 'scale(1)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
})
</script>
