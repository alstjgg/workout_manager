<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4">This Week's Changes</h3>
    <div class="space-y-3">
      <div 
        v-for="change in weeklyChanges" 
        :key="change.metric"
        class="flex justify-between items-center"
      >
        <span class="capitalize font-medium text-gray-700">
          {{ formatMetricName(change.metric) }}
        </span>
        <div :class="getChangeColorClass(change.value)">
          <component :is="getChangeIcon(change.value)" class="w-4 h-4" />
          <span class="font-semibold ml-1">
            {{ formatChangeValue(change.value, change.unit) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Weekly Summary -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
        <h4 class="font-medium text-blue-800 mb-1">Weekly Summary</h4>
        <p class="text-blue-700 text-sm">{{ getWeeklySummary() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentUser: {
    type: String,
    required: true
  },
  progressData: {
    type: Object,
    required: true
  }
})

// Sample data - this would come from the user store in a real implementation
const sampleWeeklyChanges = computed(() => {
  if (props.currentUser === 'A') {
    return {
      weight: { value: 0.3, unit: 'kg' },
      muscleMass: { value: 0.2, unit: 'kg' },
      bodyFat: { value: -0.1, unit: '%' },
      visceralFat: { value: 0, unit: '' }
    }
  } else {
    return {
      weight: { value: -1.8, unit: 'kg' },
      muscleMass: { value: 0.1, unit: 'kg' },
      bodyFat: { value: -2.1, unit: '%' },
      visceralFat: { value: -1, unit: '' }
    }
  }
})

const weeklyChanges = computed(() => {
  return Object.entries(sampleWeeklyChanges.value).map(([metric, data]) => ({
    metric,
    value: data.value,
    unit: data.unit
  }))
})

// Methods
const formatMetricName = (metric) => {
  const names = {
    weight: 'Weight',
    muscleMass: 'Muscle Mass',
    bodyFat: 'Body Fat %',
    visceralFat: 'Visceral Fat'
  }
  return names[metric] || metric.replace(/([A-Z])/g, ' $1')
}

const getChangeColorClass = (value) => {
  const baseClass = 'flex items-center space-x-1'
  if (value > 0) return `${baseClass} text-green-600`
  if (value < 0) return `${baseClass} text-blue-600`
  return `${baseClass} text-gray-600`
}

const getChangeIcon = (value) => {
  if (value > 0) return ArrowUpIcon
  if (value < 0) return ArrowDownIcon
  return MinusIcon
}

const formatChangeValue = (value, unit) => {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}${unit}`
}

const getWeeklySummary = () => {
  if (props.currentUser === 'A') {
    return "Great muscle building progress! Weight increase with maintained body fat shows quality muscle growth."
  } else {
    return "Excellent fat loss progress! You're losing weight while preserving muscle mass - exactly what we want!"
  }
}
</script>