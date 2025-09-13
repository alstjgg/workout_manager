<template>
  <div class="bg-white rounded-lg p-4 border border-gray-200">
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-medium text-gray-800 text-sm">{{ label }}</h4>
      <div :class="[
        'text-sm font-semibold',
        trendColor
      ]">
        {{ data.change }}
      </div>
    </div>
    
    <!-- SVG Chart -->
    <div class="relative h-16 mb-2">
      <svg class="w-full h-full" viewBox="0 0 100 64" v-if="chartPoints.length > 0">
        <polyline
          fill="none"
          :stroke="color"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          :points="chartPoints"
        />
        <!-- Data points -->
        <circle
          v-for="(point, idx) in parsedPoints"
          :key="idx"
          :cx="point.x"
          :cy="point.y"
          r="2"
          :fill="color"
        />
      </svg>
      <!-- Fallback for no data -->
      <div v-else class="flex items-center justify-center h-full text-gray-400 text-xs">
        No data available
      </div>
    </div>
    
    <!-- Current value -->
    <div class="text-center">
      <span class="text-lg font-bold text-gray-800">{{ data.current }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.current && value.change && value.trend && Array.isArray(value.history)
    }
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
})

// Calculate chart coordinates
const chartPoints = computed(() => {
  if (!props.data.history || props.data.history.length === 0) return ''
  
  const history = props.data.history
  const maxValue = Math.max(...history)
  const minValue = Math.min(...history)
  const range = maxValue - minValue || 1
  
  return history.map((value, idx) => {
    const x = (idx * 100) / (history.length - 1)
    const y = 64 - ((value - minValue) / range) * 64
    return `${x},${y}`
  }).join(' ')
})

const parsedPoints = computed(() => {
  if (!props.data.history || props.data.history.length === 0) return []
  
  const history = props.data.history
  const maxValue = Math.max(...history)
  const minValue = Math.min(...history)
  const range = maxValue - minValue || 1
  
  return history.map((value, idx) => ({
    x: (idx * 100) / (history.length - 1),
    y: 64 - ((value - minValue) / range) * 64
  }))
})

const trendColor = computed(() => {
  switch (props.data.trend) {
    case 'up': return 'text-green-600'
    case 'down': return 'text-blue-600'
    case 'stable': return 'text-gray-600'
    default: return 'text-gray-600'
  }
})
</script>