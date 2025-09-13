<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800">Strength Benchmarks</h3>
      <button
        @click="showUpdateModal = true"
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
            :class="getChangeClass(exercise.change)"
            class="text-xs"
          >
            {{ formatChange(exercise.change) }}
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
          <div class="text-lg font-bold text-yellow-800">
            {{ getBestLift('deadlift') }}
          </div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div class="text-sm text-green-600">Best Squat</div>
          <div class="text-lg font-bold text-green-800">
            {{ getBestLift('squat') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Update Modal Placeholder -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Update Strength</h3>
        <p class="text-sm text-gray-600 mb-4">
          This will connect to workout tracking in a future update.
        </p>
        <button 
          @click="showUpdateModal = false"
          :class="buttonColor"
          class="w-full py-3 rounded-lg font-semibold text-white"
        >
          Close
        </button>
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

const showUpdateModal = ref(false)

// Sample strength data
const strengthData = computed(() => {
  if (props.currentUser === 'A') {
    return [
      { 
        name: 'Deadlift', 
        current: '65kg', 
        change: 5, 
        lastUpdate: '2024-01-15' 
      },
      { 
        name: 'Squat', 
        current: '45kg', 
        change: 2.5, 
        lastUpdate: '2024-01-12' 
      },
      { 
        name: 'Hip Thrust', 
        current: '80kg', 
        change: 10, 
        lastUpdate: '2024-01-10' 
      },
      { 
        name: 'Overhead Press', 
        current: '35kg', 
        change: 2.5, 
        lastUpdate: '2024-01-08' 
      }
    ]
  } else {
    return [
      { 
        name: 'Deadlift', 
        current: '45kg', 
        change: 5, 
        lastUpdate: '2024-01-14' 
      },
      { 
        name: 'Squat', 
        current: '35kg', 
        change: 5, 
        lastUpdate: '2024-01-11' 
      },
      { 
        name: 'Romanian DL', 
        current: '25kg', 
        change: 2.5, 
        lastUpdate: '2024-01-09' 
      },
      { 
        name: 'Shoulder Press', 
        current: '25kg', 
        change: 2.5, 
        lastUpdate: '2024-01-07' 
      }
    ]
  }
})

const buttonColor = computed(() => 
  props.currentUser === 'A' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-pink-500 hover:bg-pink-600'
)

// Methods
const getChangeClass = (change) => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
}

const formatChange = (change) => {
  const prefix = change > 0 ? '+' : ''
  return `${prefix}${change}kg`
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

const getBestLift = (exercise) => {
  const exerciseData = strengthData.value.find(item => 
    item.name.toLowerCase().includes(exercise)
  )
  return exerciseData ? exerciseData.current : 'N/A'
}
</script>