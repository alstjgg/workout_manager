<template>
  <div :style="userSelectorStyles">
    <button
      @click="selectUser('A')"
      :style="getUserButtonStyle('A')"
      @mouseover="hoveredButton = 'A'"
      @mouseleave="hoveredButton = null"
    >
      <div :style="buttonContentStyles">
        <div :style="getUserIndicatorStyle('A')"></div>
        <span>User A</span>
      </div>
    </button>
    <button
      @click="selectUser('B')"
      :style="getUserButtonStyle('B')"
      @mouseover="hoveredButton = 'B'"
      @mouseleave="hoveredButton = null"
    >
      <div :style="buttonContentStyles">
        <div :style="getUserIndicatorStyle('B')"></div>
        <span>User B</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

// Emits
const emit = defineEmits(['userChanged'])

// Reactive data
const hoveredButton = ref(null)

// Computed styles
const userSelectorStyles = computed(() => ({
  display: 'flex',
  gap: '8px'
}))

const buttonContentStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}))

// Methods
const selectUser = (userId) => {
  if (userId !== props.currentUser) {
    emit('userChanged', userId)
  }
}

const getUserButtonStyle = (userId) => {
  const isActive = props.currentUser === userId
  const isHovered = hoveredButton.value === userId
  
  if (isActive) {
    return {
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: userId === 'A' ? '#8b5cf6' : '#ec4899',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    }
  } else {
    return {
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: isHovered ? '#f3f4f6' : '#f9fafb',
      color: '#374151',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)'
    }
  }
}

const getUserIndicatorStyle = (userId) => {
  const isActive = props.currentUser === userId
  return {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isActive ? 'white' : '#9ca3af'
  }
}
</script>
