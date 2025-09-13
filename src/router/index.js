import { createRouter, createWebHistory } from 'vue-router'

// View components
const TodayView = () => import('@/views/TodayView.vue')
const WeekView = () => import('@/views/WeekView.vue')
const ProgressView = () => import('@/views/ProgressView.vue')
const WorkoutView = () => import('@/views/WorkoutView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')

const routes = [
  {
    path: '/',
    name: 'Today',
    component: TodayView,
    meta: {
      title: 'Today\'s Workout',
      requiresAuth: false
    }
  },
  {
    path: '/week',
    name: 'Week',
    component: WeekView,
    meta: {
      title: 'Weekly Overview',
      requiresAuth: false
    }
  },
  {
    path: '/progress',
    name: 'Progress',
    component: ProgressView,
    meta: {
      title: 'Progress Tracking',
      requiresAuth: false
    }
  },
  {
    path: '/workout/:workoutId?',
    name: 'Workout',
    component: WorkoutView,
    meta: {
      title: 'Active Workout',
      requiresAuth: false,
      hideNavigation: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      title: 'Settings',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Workout Manager`
  }
  
  // Handle authentication if needed in the future
  if (to.meta.requiresAuth) {
    // Check authentication status
    // For now, no authentication required
  }
  
  // Analytics tracking
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: to.meta.title,
      page_location: to.fullPath
    })
  }
  
  next()
})

router.afterEach((to, from) => {
  // Track page views
  console.log(`📍 Navigated from ${from.path} to ${to.path}`)
})

export default router