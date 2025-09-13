<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800">AI Analysis</h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
        <span class="text-xs text-gray-500">Updated {{ lastUpdateTime }}</span>
      </div>
    </div>
    
    <!-- Current Analysis -->
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
      <div class="flex items-start space-x-2">
        <div class="text-blue-600 mt-0.5">🤖</div>
        <div>
          <h4 class="font-medium text-blue-800 mb-1">Weekly Insights</h4>
          <p class="text-blue-700 text-sm">{{ getCurrentAnalysis() }}</p>
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
          buttonColor,
          isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        ]"
      >
        {{ isGenerating ? 'Analyzing...' : 'Generate New Report' }}
      </button>
    </div>
    
    <!-- Report History -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <h4 class="font-medium text-gray-800 mb-2">Recent Reports</h4>
      <div class="space-y-2">
        <div 
          v-for="report in reportHistory" 
          :key="report.date"
          class="flex justify-between items-center text-sm"
        >
          <span class="text-gray-600">{{ formatReportDate(report.date) }}</span>
          <button class="text-blue-600 hover:text-blue-800">View</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  currentUser: {
    type: String,
    required: true
  }
})

const isGenerating = ref(false)

const lastUpdateTime = computed(() => '2 hours ago')

const buttonColor = computed(() => 
  props.currentUser === 'A' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-pink-500 hover:bg-pink-600'
)

const reportHistory = ref([
  { date: '2024-01-15', type: 'weekly' },
  { date: '2024-01-08', type: 'weekly' },
  { date: '2024-01-01', type: 'monthly' }
])

// Methods
const getCurrentAnalysis = () => {
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
  
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isGenerating.value = false
  
  // In real implementation, this would call Claude AI service
  console.log(`🤖 Generated new AI report for User ${props.currentUser}`)
}

const formatReportDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>