<template>
    <div id="app" class="min-h-screen bg-gray-50">
      <!-- Header with User Selector -->
      <header :class="[
        'p-4 pb-6 text-white',
        currentUser === 'A' ? 'bg-purple-500' : 'bg-pink-500'
      ]">
        <div class="max-w-md mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold">Workout Manager</h1>
            <div class="text-sm opacity-90">
              {{ getCurrentDate() }}
            </div>
          </div>
          
          <!-- User Selector -->
          <div class="flex bg-black bg-opacity-20 rounded-lg p-1">
            <button
              @click="userStore.switchUser('A')"
              :class="[
                'flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm',
                currentUser === 'A' 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              ]"
            >
              {{ getUserDisplayName('A') }}
              <div class="text-xs opacity-80">{{ getUserGoal('A') }}</div>
            </button>
            <button
              @click="userStore.switchUser('B')"
              :class="[
                'flex-1 py-2 px-3 rounded-md font-medium transition-all text-sm',
                currentUser === 'B' 
                  ? 'bg-white text-gray-800 shadow-lg' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              ]"
            >
              {{ getUserDisplayName('B') }}
              <div class="text-xs opacity-80">{{ getUserGoal('B') }}</div>
            </button>
          </div>
          
          <!-- Current status -->
          <div class="text-sm opacity-90 mt-3">
            {{ getStatusMessage() }}
          </div>
        </div>
      </header>
  
      <!-- Bottom Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-md mx-auto">
          <div class="flex">
            <router-link
              to="/"
              class="flex-1 py-4 flex flex-col items-center space-y-1"
              :class="[$route.path === '/' ? (currentUser === 'A' ? 'text-purple-500' : 'text-pink-500') : 'text-gray-400']"
            >
              <HomeIcon class="w-5 h-5" />
              <span class="text-xs">Today</span>
            </router-link>
            <router-link
              to="/week"
              class="flex-1 py-4 flex flex-col items-center space-y-1"
              :class="[$route.path === '/week' ? (currentUser === 'A' ? 'text-purple-500' : 'text-pink-500') : 'text-gray-400']"
            >
              <CalendarDaysIcon class="w-5 h-5" />
              <span class="text-xs">Week</span>
            </router-link>
            <router-link
              to="/progress"
              class="flex-1 py-4 flex flex-col items-center space-y-1"
              :class="[$route.path === '/progress' ? (currentUser === 'A' ? 'text-purple-500' : 'text-pink-500') : 'text-gray-400']"
            >
              <ChartBarIcon class="w-5 h-5" />
              <span class="text-xs">Progress</span>
            </router-link>
            <router-link
              to="/settings"
              class="flex-1 py-4 flex flex-col items-center space-y-1"
              :class="[$route.path === '/settings' ? (currentUser === 'A' ? 'text-purple-500' : 'text-pink-500') : 'text-gray-400']"
            >
              <Cog6ToothIcon class="w-5 h-5" />
              <span class="text-xs">Settings</span>
            </router-link>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <main class="max-w-md mx-auto">
        <router-view :current-user="currentUser" :key="currentUser" />
      </main>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useUserStore } from '@/stores/userStore'
  import { 
    HomeIcon, 
    CalendarDaysIcon, 
    ChartBarIcon,
    Cog6ToothIcon
  } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const userStore = useUserStore()
  
  // Use userStore for current user state
  const currentUser = computed(() => userStore.currentUser)
  
  // Methods
  const getUserDisplayName = (userId) => {
    const profile = userStore.getUserProfile(userId)
    return profile?.name || `User ${userId}`
  }
  
  const getUserGoal = (userId) => {
    const profile = userStore.getUserProfile(userId)
    if (!profile) return userId === 'A' ? 'Muscle Building' : 'Weight Loss'
    
    return profile.goal === 'muscle_building' ? 'Muscle Building' : 'Weight Loss'
  }
  
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  const getStatusMessage = () => {
    const routeMessages = {
      '/': 'Ready to train?',
      '/week': 'Plan your week',
      '/progress': 'Track your gains',
      '/settings': 'Customize your experience'
    }
    return routeMessages[route.path] || 'Welcome back!'
  }
  
  console.log('✅ App.vue with userStore integration loaded')
  </script>