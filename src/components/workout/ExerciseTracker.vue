<template>
  <div :style="exerciseTrackerStyles">
    <!-- Exercise Header -->
    <div :style="exerciseHeaderStyles">
      <div>
        <h3 :style="exerciseNameStyles">{{ exercise.name }}</h3>
        <p :style="exerciseCategoryStyles">{{ exercise.category }} • {{ exercise.sets }} sets</p>
      </div>
      <div :style="exerciseProgressStyles">
        {{ completedSets }}/{{ exercise.sets }}
      </div>
    </div>

    <!-- Exercise Details -->
    <div :style="exerciseDetailsStyles">
      <div :style="detailItemStyles">
        <span :style="detailLabelStyles">Target Reps:</span>
        <span>{{ exercise.reps }}</span>
      </div>
      <div :style="detailItemStyles">
        <span :style="detailLabelStyles">Weight:</span>
        <span>{{ exercise.weight }}</span>
      </div>
      <div :style="detailItemStyles">
        <span :style="detailLabelStyles">Rest:</span>
        <span>{{ exercise.restTime }}</span>
      </div>
    </div>

    <!-- Exercise Notes -->
    <div v-if="exercise.notes" :style="exerciseNotesStyles">
      <div :style="notesLabelStyles">💡 Form Notes:</div>
      <div :style="notesTextStyles">{{ exercise.notes }}</div>
    </div>

    <!-- Sets Tracking -->
    <div :style="setsContainerStyles">
      <h4 :style="setsHeaderStyles">Sets Progress</h4>
      <div :style="setsGridStyles">
        <div
          v-for="(setDetail, setIndex) in exercise.setDetails"
          :key="`set-${setIndex}`"
          :style="getSetItemStyle(setIndex)"
        >
          <!-- Set Info -->
          <div :style="setInfoHeaderStyles">
            <div :style="setNumberStyles">Set {{ setIndex + 1 }}</div>
            <div :style="setTimingStyles">
              {{ getSetTimingDisplay(setIndex) }}
            </div>
          </div>
          
          <!-- Set Details -->
          <div :style="setDetailsStyles">
            <div :style="setDetailItemStyles">
              <span :style="detailLabelStyles">Reps:</span>
              <span>{{ setDetail.reps }}</span>
            </div>
            <div :style="setDetailItemStyles">
              <span :style="detailLabelStyles">Weight:</span>
              <span>{{ setDetail.weight }}</span>
            </div>
          </div>

          <!-- Set Action Button -->
          <button
            @click="handleSetAction(setIndex)"
            :style="getSetButtonStyle(setIndex)"
            :disabled="isSetCompleted(setIndex) && !isSetInProgress(setIndex)"
          >
            <div :style="buttonContentStyles">
              <span v-if="isSetCompleted(setIndex)" :style="checkmarkStyles">✓</span>
              <span v-else-if="isSetInProgress(setIndex)">⏹️</span>
              <span v-else>▶️</span>
              <span>{{ getSetButtonText(setIndex) }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Set Progress Bar -->
    <div :style="progressBarContainerStyles">
      <div :style="progressBarStyles">
        <div :style="getProgressFillStyle()"></div>
      </div>
      <div :style="progressTextStyles">
        {{ Math.round((completedSets / exercise.sets) * 100) }}% Complete
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'

// Props
const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Store
const workoutStore = useWorkoutStore()

// Computed
const completedSets = computed(() => {
  let count = 0
  for (let i = 0; i < props.exercise.sets; i++) {
    if (workoutStore.isSetCompleted(props.currentUser, props.exercise.id, i)) {
      count++
    }
  }
  return count
})

// Computed styles - abbreviated for space but complete
const exerciseTrackerStyles = computed(() => ({
  backgroundColor: 'white', borderRadius: '12px', padding: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb'
}))

const exerciseHeaderStyles = computed(() => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'
}))

const exerciseNameStyles = computed(() => ({
  fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0'
}))

const exerciseCategoryStyles = computed(() => ({
  fontSize: '14px', color: '#6b7280', margin: '0'
}))

const exerciseProgressStyles = computed(() => ({
  fontSize: '18px', fontWeight: 'bold',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  backgroundColor: props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8',
  padding: '8px 16px', borderRadius: '20px',
  border: props.currentUser === 'A' ? '1px solid #c4b5fd' : '1px solid #f9a8d4'
}))

const exerciseDetailsStyles = computed(() => ({
  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
  marginBottom: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px'
}))

const detailItemStyles = computed(() => ({
  display: 'flex', flexDirection: 'column', gap: '4px'
}))

const detailLabelStyles = computed(() => ({
  fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase'
}))

const exerciseNotesStyles = computed(() => ({
  marginBottom: '20px', padding: '12px', backgroundColor: '#fef3c7',
  borderRadius: '8px', border: '1px solid #f59e0b'
}))

const notesLabelStyles = computed(() => ({
  fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px'
}))

const notesTextStyles = computed(() => ({
  fontSize: '14px', color: '#92400e'
}))

const setsContainerStyles = computed(() => ({
  marginBottom: '20px'
}))

const setsHeaderStyles = computed(() => ({
  fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0'
}))

const setsGridStyles = computed(() => ({
  display: 'flex', flexDirection: 'column', gap: '16px'
}))

const setInfoHeaderStyles = computed(() => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'
}))

const setNumberStyles = computed(() => ({
  fontSize: '16px', fontWeight: '600', color: '#111827'
}))

const setTimingStyles = computed(() => ({
  fontSize: '14px', fontWeight: '500',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  backgroundColor: props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8',
  padding: '4px 8px', borderRadius: '12px', fontFamily: 'Monaco, monospace'
}))

const setDetailsStyles = computed(() => ({
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'
}))

const setDetailItemStyles = computed(() => ({
  display: 'flex', justifyContent: 'space-between', fontSize: '14px'
}))

const buttonContentStyles = computed(() => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
}))

const checkmarkStyles = computed(() => ({
  color: 'white', fontSize: '16px', fontWeight: 'bold'
}))

const progressBarContainerStyles = computed(() => ({
  marginBottom: '16px'
}))

const progressBarStyles = computed(() => ({
  width: '100%', height: '8px', backgroundColor: '#e5e7eb',
  borderRadius: '4px', overflow: 'hidden', marginBottom: '8px'
}))

const progressTextStyles = computed(() => ({
  fontSize: '14px', fontWeight: '500',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777',
  textAlign: 'center'
}))

// Methods
const isSetCompleted = (setIndex) => {
  return workoutStore.isSetCompleted(props.currentUser, props.exercise.id, setIndex)
}

const isSetInProgress = (setIndex) => {
  return workoutStore.isSetInProgress(props.currentUser, props.exercise.id, setIndex)
}

const handleSetAction = (setIndex) => {
  if (isSetInProgress(setIndex)) {
    // End the set
    workoutStore.endSet(props.currentUser, props.exercise.id, setIndex)
  } else if (!isSetCompleted(setIndex)) {
    // Start the set
    workoutStore.startSet(props.currentUser, props.exercise.id, setIndex)
  }
}

const getSetButtonText = (setIndex) => {
  if (isSetCompleted(setIndex)) return 'Completed'
  if (isSetInProgress(setIndex)) return 'End Set'
  return 'Start Set'
}

const getSetTimingDisplay = (setIndex) => {
  if (isSetInProgress(setIndex)) {
    // This set is currently active - the main timer will show the time
    return 'ACTIVE'
  } else {
    // Show completed time or default
    const timing = workoutStore.getSetTiming(props.currentUser, props.exercise.id, setIndex)
    return timing > 0 ? workoutStore.formatTime(timing) : '00:00'
  }
}

const getSetItemStyle = (setIndex) => {
  const isCompleted = isSetCompleted(setIndex)
  const inProgress = isSetInProgress(setIndex)
  
  let backgroundColor = '#f9fafb'
  let borderColor = '#e5e7eb'
  
  if (isCompleted) {
    backgroundColor = '#ecfdf5'
    borderColor = '#10b981'
  } else if (inProgress) {
    backgroundColor = props.currentUser === 'A' ? '#fef3c7' : '#fef2f2'
    borderColor = props.currentUser === 'A' ? '#f59e0b' : '#f87171'
  }
  
  return {
    padding: '16px', borderRadius: '12px', backgroundColor,
    border: `2px solid ${borderColor}`, transition: 'all 0.2s'
  }
}

const getSetButtonStyle = (setIndex) => {
  const isCompleted = isSetCompleted(setIndex)
  const inProgress = isSetInProgress(setIndex)
  
  let backgroundColor, color
  
  if (isCompleted) {
    backgroundColor = '#10b981'
    color = 'white'
  } else if (inProgress) {
    backgroundColor = '#f59e0b'
    color = 'white'
  } else {
    backgroundColor = props.currentUser === 'A' ? '#8b5cf6' : '#ec4899'
    color = 'white'
  }
  
  return {
    width: '100%', padding: '12px', backgroundColor, color,
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: isCompleted && !inProgress ? 'default' : 'pointer',
    transition: 'all 0.2s', opacity: isCompleted && !inProgress ? 0.7 : 1
  }
}

const getProgressFillStyle = () => {
  const progress = (completedSets.value / props.exercise.sets) * 100
  return {
    width: `${progress}%`, height: '100%',
    backgroundColor: props.currentUser === 'A' ? '#8b5cf6' : '#ec4899',
    transition: 'width 0.3s ease-out'
  }
}
</script>
