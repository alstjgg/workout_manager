<template>
  <div :style="weekScheduleStyles">
    <div 
      v-for="(day, index) in weekDays"
      :key="day.name"
      :style="getDayRowStyle(day.status)"
      @click="handleDayClick(day)"
    >
      <div>
        <div :style="dayNameStyles">{{ day.name }}</div>
        <div :style="dayWorkoutStyles">{{ day.workout }}</div>
      </div>
      <div :style="getDayStatusStyle(day.status)">
        {{ getStatusIcon(day.status) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  weekDays: {
    type: Array,
    required: true,
    validator: (days) => {
      return days.every(day => 
        day.hasOwnProperty('name') && 
        day.hasOwnProperty('workout') && 
        day.hasOwnProperty('status')
      )
    }
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
const emit = defineEmits(['day-clicked'])

// Computed styles
const weekScheduleStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}))

const dayNameStyles = computed(() => ({
  fontWeight: '600',
  color: '#111827',
  fontSize: '16px'
}))

const dayWorkoutStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280'
}))

// Methods
const handleDayClick = (day) => {
  emit('day-clicked', day)
}

const getStatusIcon = (status) => {
  const icons = {
    completed: '✅',
    today: '👆',
    rest: '😴',
    cancelled: '❌',
    planned: '📅'
  }
  return icons[status] || '📅'
}

const getDayRowStyle = (status) => {
  let bgColor = '#f9fafb'
  let borderColor = '#e5e7eb'
  
  if (status === 'completed') {
    bgColor = '#ecfdf5'
    borderColor = '#10b981'
  } else if (status === 'today') {
    bgColor = props.currentUser === 'A' ? '#f3e8ff' : '#fdf2f8'
    borderColor = props.currentUser === 'A' ? '#8b5cf6' : '#ec4899'
  } else if (status === 'cancelled') {
    bgColor = '#fef2f2'
    borderColor = '#ef4444'
  } else if (status === 'rest') {
    bgColor = '#f1f5f9'
    borderColor = '#94a3b8'
  }
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: bgColor,
    borderRadius: '8px',
    border: `2px solid ${borderColor}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      transform: 'scale(1.01)'
    }
  }
}

const getDayStatusStyle = (status) => ({
  fontSize: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})
</script>
