<template>
  <div class="space-y-6 p-4">
    <!-- Update Body Composition Button -->
    <div class="bg-white rounded-xl shadow-lg p-4">
      <button 
        @click="showAlert"
        :class="[
          'w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center space-x-2',
          currentUser === 'A' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-pink-500 hover:bg-pink-600'
        ]"
      >
        <PencilIcon class="w-4 h-4" />
        <span>Update Body Composition</span>
      </button>
    </div>

    <!-- Progress Charts -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">Progress Trends</h2>
        <ChartBarIcon class="w-5 h-5 text-gray-500" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <!-- Weight Chart -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-medium text-gray-800 text-sm">Weight</h4>
            <div class="text-sm font-semibold text-green-600">
              {{ progressData.weight.change }}
            </div>
          </div>
          <div class="relative h-16 mb-2">
            <svg class="w-full h-full" viewBox="0 0 100 64">
              <polyline
                fill="none"
                stroke="#3b82f6"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="getChartPoints(progressData.weight.history)"
              />
              <circle
                v-for="(point, idx) in getPoints(progressData.weight.history)"
                :key="idx"
                :cx="point.x"
                :cy="point.y"
                r="2"
                fill="#3b82f6"
              />
            </svg>
          </div>
          <div class="text-center">
            <span class="text-lg font-bold text-gray-800">{{ progressData.weight.current }}</span>
          </div>
        </div>

        <!-- Muscle Mass Chart -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-medium text-gray-800 text-sm">Muscle Mass</h4>
            <div class="text-sm font-semibold text-green-600">
              {{ progressData.muscle.change }}
            </div>
          </div>
          <div class="relative h-16 mb-2">
            <svg class="w-full h-full" viewBox="0 0 100 64">
              <polyline
                fill="none"
                stroke="#10b981"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="getChartPoints(progressData.muscle.history)"
              />
              <circle
                v-for="(point, idx) in getPoints(progressData.muscle.history)"
                :key="idx"
                :cx="point.x"
                :cy="point.y"
                r="2"
                fill="#10b981"
              />
            </svg>
          </div>
          <div class="text-center">
            <span class="text-lg font-bold text-gray-800">{{ progressData.muscle.current }}</span>
          </div>
        </div>

        <!-- Body Fat Chart -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-medium text-gray-800 text-sm">Body Fat %</h4>
            <div class="text-sm font-semibold text-blue-600">
              {{ progressData.bodyFat.change }}
            </div>
          </div>
          <div class="relative h-16 mb-2">
            <svg class="w-full h-full" viewBox="0 0 100 64">
              <polyline
                fill="none"
                stroke="#ef4444"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="getChartPoints(progressData.bodyFat.history)"
              />
              <circle
                v-for="(point, idx) in getPoints(progressData.bodyFat.history)"
                :key="idx"
                :cx="point.x"
                :cy="point.y"
                r="2"
                fill="#ef4444"
              />
            </svg>
          </div>
          <div class="text-center">
            <span class="text-lg font-bold text-gray-800">{{ progressData.bodyFat.current }}</span>
          </div>
        </div>

        <!-- Visceral Fat Chart -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-medium text-gray-800 text-sm">Visceral Fat</h4>
            <div class="text-sm font-semibold text-gray-600">
              {{ progressData.visceral.change }}
            </div>
          </div>
          <div class="relative h-16 mb-2">
            <svg class="w-full h-full" viewBox="0 0 100 64">
              <polyline
                fill="none"
                stroke="#f59e0b"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="getChartPoints(progressData.visceral.history)"
              />
              <circle
                v-for="(point, idx) in getPoints(progressData.visceral.history)"
                :key="idx"
                :cx="point.x"
                :cy="point.y"
                r="2"
                fill="#f59e0b"
              />
            </svg>
          </div>
          <div class="text-center">
            <span class="text-lg font-bold text-gray-800">{{ progressData.visceral.current }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Changes -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">This Week's Changes</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="capitalize font-medium text-gray-700">Weight</span>
          <div class="flex items-center space-x-1 text-green-600">
            <ArrowUpIcon v-if="weeklyChanges.weight > 0" class="w-4 h-4" />
            <ArrowDownIcon v-else-if="weeklyChanges.weight < 0" class="w-4 h-4" />
            <MinusIcon v-else class="w-4 h-4" />
            <span class="font-semibold">{{ formatChange(weeklyChanges.weight, 'kg') }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="capitalize font-medium text-gray-700">Muscle Mass</span>
          <div class="flex items-center space-x-1 text-green-600">
            <ArrowUpIcon v-if="weeklyChanges.muscle > 0" class="w-4 h-4" />
            <ArrowDownIcon v-else-if="weeklyChanges.muscle < 0" class="w-4 h-4" />
            <MinusIcon v-else class="w-4 h-4" />
            <span class="font-semibold">{{ formatChange(weeklyChanges.muscle, 'kg') }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="capitalize font-medium text-gray-700">Body Fat %</span>
          <div class="flex items-center space-x-1 text-blue-600">
            <ArrowUpIcon v-if="weeklyChanges.bodyFat > 0" class="w-4 h-4" />
            <ArrowDownIcon v-else-if="weeklyChanges.bodyFat < 0" class="w-4 h-4" />
            <MinusIcon v-else class="w-4 h-4" />
            <span class="font-semibold">{{ formatChange(weeklyChanges.bodyFat, '%') }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="capitalize font-medium text-gray-700">Visceral Fat</span>
          <div class="flex items-center space-x-1 text-blue-600">
            <ArrowUpIcon v-if="weeklyChanges.visceral > 0" class="w-4 h-4" />
            <ArrowDownIcon v-else-if="weeklyChanges.visceral < 0" class="w-4 h-4" />
            <MinusIcon v-else class="w-4 h-4" />
            <span class="font-semibold">{{ formatChange(weeklyChanges.visceral, '') }}</span>
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

    <!-- Strength Benchmarks -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800">Strength Benchmarks</h3>
        <button
          @click="showAlert"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Update
        </button>
      </div>
      
      <div class="space-y-4">
        <div 
          v-for="exercise in strengthData" 
          :key="exercise.name"
          class="flex justify-between items-center"
        >
          <div>
            <span class="font-medium text-gray-800">{{ exercise.name }}</span>
            <div v-if="exercise.lastUpdate" class="text-xs text-gray-500">
              Updated {{ formatDate(exercise.lastUpdate) }}
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold">{{ exercise.current }}</span>
            <div 
              v-if="exercise.change"
              :class="exercise.change > 0 ? 'text-green-600' : 'text-red-600'"
              class="text-xs"
            >
              {{ exercise.change > 0 ? '+' : '' }}{{ exercise.change }}kg
            </div>
          </div>
        </div>
      </div>
      
      <!-- Personal Records -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <h4 class="font-medium text-gray-800 mb-2">Personal Records</h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div class="text-sm text-yellow-600">Best Deadlift</div>
            <div class="text-lg font-bold text-yellow-800">65kg</div>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div class="text-sm text-green-600">Best Squat</div>
            <div class="text-lg font-bold text-green-800">45kg</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Analysis -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800">AI Analysis</h3>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-xs text-gray-500">Updated 2 hours ago</span>
        </div>
      </div>
      
      <!-- Current Analysis -->
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
        <div class="flex items-start space-x-2">
          <div class="text-blue-600 mt-0.5">🤖</div>
          <div>
            <h4 class="font-medium text-blue-800 mb-1">Weekly Insights</h4>
            <p class="text-blue-700 text-sm">{{ getAIAnalysis() }}</p>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="space-y-3 mb-4">
        <h4 class="font-medium text-gray-800">Recommendations</h4>
        <div 
          v-for="(recommendation, index) in getRecommendations()" 
          :key="index"
          class="bg-gray-50 border border-gray-200 rounded-lg p-3"
        >
          <div class="flex items-start space-x-2">
            <div class="text-purple-600 mt-0.5">{{ recommendation.icon }}</div>
            <div>
              <div class="font-medium text-gray-800 text-sm">{{ recommendation.title }}</div>
              <div class="text-gray-600 text-xs">{{ recommendation.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <button 
          @click="generateNewReport"
          :disabled="isGenerating"
          :class="[
            'flex-1 py-3 rounded-lg font-semibold text-white transition-opacity',
            currentUser === 'A' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-pink-500 hover:bg-pink-600',
            isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          ]"
        >
          {{ isGenerating ? 'Analyzing...' : 'Generate New Report' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PencilIcon, ChartBarIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentUser: {
    type: String,
    required: true,
    validator: value => ['A', 'B'].includes(value)
  }
})

const isGenerating = ref(false)

// Sample progress data - matches prototype exactly
const progressData = computed(() => {
  if (props.currentUser === 'A') {
    return {
      weight: { 
        current: '48.3kg', 
        change: '+0.3kg', 
        trend: 'up', 
        history: [47.8, 47.9, 48.1, 48.3] 
      },
      muscle: { 
        current: '22.1kg', 
        change: '+0.2kg', 
        trend: 'up', 
        history: [21.7, 21.8, 21.9, 22.1] 
      },
      bodyFat: { 
        current: '18.5%', 
        change: '-0.1%', 
        trend: 'down', 
        history: [18.8, 18.7, 18.6, 18.5] 
      },
      visceral: { 
        current: '2', 
        change: '0', 
        trend: 'stable', 
        history: [2, 2, 2, 2] 
      }
    }
  } else {
    return {
      weight: { 
        current: '65.2kg', 
        change: '-1.8kg', 
        trend: 'down', 
        history: [67.5, 66.8, 66.1, 65.2] 
      },
      muscle: { 
        current: '26.8kg', 
        change: '+0.1kg', 
        trend: 'up', 
        history: [26.5, 26.6, 26.7, 26.8] 
      },
      bodyFat: { 
        current: '27.2%', 
        change: '-2.1%', 
        trend: 'down', 
        history: [29.8, 29.1, 28.4, 27.2] 
      },
      visceral: { 
        current: '4', 
        change: '-1', 
        trend: 'down', 
        history: [5, 5, 4, 4] 
      }
    }
  }
})

const weeklyChanges = computed(() => {
  if (props.currentUser === 'A') {
    return {
      weight: 0.3,
      muscle: 0.2,
      bodyFat: -0.1,
      visceral: 0
    }
  } else {
    return {
      weight: -1.8,
      muscle: 0.1,
      bodyFat: -2.1,
      visceral: -1
    }
  }
})

const strengthData = computed(() => {
  if (props.currentUser === 'A') {
    return [
      { name: 'Deadlift', current: '65kg', change: 5, lastUpdate: '2024-01-15' },
      { name: 'Squat', current: '45kg', change: 2.5, lastUpdate: '2024-01-12' },
      { name: 'Hip Thrust', current: '80kg', change: 10, lastUpdate: '2024-01-10' },
      { name: 'Overhead Press', current: '35kg', change: 2.5, lastUpdate: '2024-01-08' }
    ]
  } else {
    return [
      { name: 'Deadlift', current: '45kg', change: 5, lastUpdate: '2024-01-14' },
      { name: 'Squat', current: '35kg', change: 5, lastUpdate: '2024-01-11' },
      { name: 'Romanian DL', current: '25kg', change: 2.5, lastUpdate: '2024-01-09' },
      { name: 'Shoulder Press', current: '25kg', change: 2.5, lastUpdate: '2024-01-07' }
    ]
  }
})

// Methods
const getChartPoints = (history) => {
  if (!history || history.length === 0) return ''
  
  const maxValue = Math.max(...history)
  const minValue = Math.min(...history)
  const range = maxValue - minValue || 1
  
  return history.map((value, idx) => {
    const x = (idx * 100) / (history.length - 1)
    const y = 64 - ((value - minValue) / range) * 64
    return `${x},${y}`
  }).join(' ')
}

const getPoints = (history) => {
  if (!history || history.length === 0) return []
  
  const maxValue = Math.max(...history)
  const minValue = Math.min(...history)
  const range = maxValue - minValue || 1
  
  return history.map((value, idx) => ({
    x: (idx * 100) / (history.length - 1),
    y: 64 - ((value - minValue) / range) * 64
  }))
}

const formatChange = (value, unit) => {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}${unit}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

const getWeeklySummary = () => {
  if (props.currentUser === 'A') {
    return "Great muscle building progress! Weight increase with maintained body fat shows quality muscle growth."
  } else {
    return "Excellent fat loss progress! You're losing weight while preserving muscle mass - exactly what we want!"
  }
}

const getAIAnalysis = () => {
  if (props.currentUser === 'A') {
    return "Excellent progress on glute development! Your hip thrust strength has increased by 12.5% this week. Consider adding single-leg variations to address any imbalances. Your muscle gain is on track - the 0.3kg weight increase with stable body fat indicates quality muscle growth."
  } else {
    return "Outstanding fat loss progress! You're losing 1.8kg per week while maintaining muscle mass - exactly what we want for sustainable results. Your metabolic training is working well. Consider adding one more cardio finisher to accelerate progress toward your goal."
  }
}

const getRecommendations = () => {
  if (props.currentUser === 'A') {
    return [
      {
        icon: '💪',
        title: 'Progressive Overload',
        description: 'Increase hip thrust weight by 5kg next week'
      },
      {
        icon: '🥗',
        title: 'Nutrition Focus',
        description: 'Add 15g protein post-workout for muscle synthesis'
      },
      {
        icon: '😴',
        title: 'Recovery',
        description: 'Ensure 7-8 hours sleep for optimal muscle growth'
      }
    ]
  } else {
    return [
      {
        icon: '🔥',
        title: 'Metabolic Boost',
        description: 'Add 5-minute HIIT finisher to 3 sessions this week'
      },
      {
        icon: '⚖️',
        title: 'Calorie Balance',
        description: 'Maintain current deficit - it\'s working perfectly'
      },
      {
        icon: '📏',
        title: 'Measurements',
        description: 'Take progress photos - scale might not show muscle gains'
      }
    ]
  }
}

const generateNewReport = async () => {
  isGenerating.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isGenerating.value = false
  console.log(`🤖 Generated new AI report for User ${props.currentUser}`)
}

const showAlert = () => {
  alert('Body composition update will be added in Step 7!')
}
</script>