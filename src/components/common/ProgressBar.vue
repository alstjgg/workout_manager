<template>
  <div :style="progressContainerStyles">
    <div :style="progressLabelStyles">
      <span>{{ label }}</span>
      <span :style="getProgressPercentStyle()">{{ progress }}%</span>
    </div>
    <div :style="progressBarBgStyles">
      <div :style="getProgressBarStyle()"></div>
    </div>
    <div v-if="subtitle" :style="subtitleStyles">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: value => value >= 0 && value <= 100
  },
  label: {
    type: String,
    default: 'Progress'
  },
  subtitle: {
    type: String,
    default: ''
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Computed styles
const progressContainerStyles = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}))

const progressLabelStyles = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  marginBottom: '8px'
}))

const progressBarBgStyles = computed(() => ({
  width: '100%',
  backgroundColor: '#e5e7eb',
  borderRadius: '9999px',
  height: '12px',
  overflow: 'hidden'
}))

const subtitleStyles = computed(() => ({
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center'
}))

const getProgressPercentStyle = () => ({
  fontWeight: 'bold',
  color: props.currentUser === 'A' ? '#7c3aed' : '#db2777'
})

const getProgressBarStyle = () => ({
  height: '100%',
  borderRadius: '9999px',
  transition: 'width 1s ease-out',
  background: props.currentUser === 'A' 
    ? 'linear-gradient(to right, #a78bfa, #8b5cf6)'
    : 'linear-gradient(to right, #f472b6, #ec4899)',
  width: props.progress + '%'
})
</script>
