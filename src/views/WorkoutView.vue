<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Workout Header -->
    <div class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-screen-sm mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button 
              @click="goBack"
              class="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-lg font-bold text-gray-900">Active Workout</h1>
              <p class="text-sm text-gray-600">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-screen-sm mx-auto px-4 py-6">
      <div class="card text-center">
        <div class="text-6xl mb-6">🏋️‍♀️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Active Workout View</h2>
        <p class="text-gray-600 mb-6">
          The active workout tracking interface will be implemented in the next phase.
        </p>
        <button 
          @click="goBack"
          :class="currentUserButtonClass"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const currentUserButtonClass = computed(() => {
  return userStore.currentUser === 'A' 
    ? 'bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors' 
    : 'bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
})

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-8;
}
</style>