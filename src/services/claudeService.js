import axios from 'axios'

class ClaudeService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/.netlify/functions'
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // Claude AI can take longer
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`🤖 Claude API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('🤖 Claude API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        console.log(`🤖 Claude API Response: ${response.status}`)
        return response
      },
      (error) => {
        console.error('🤖 Claude API Error:', error.response?.data || error.message)
        return Promise.reject(this.handleApiError(error))
      }
    )
  }

  handleApiError(error) {
    if (error.response) {
      return new Error(error.response.data?.error || `HTTP ${error.response.status}`)
    } else if (error.request) {
      return new Error('Network error - check your connection')
    } else {
      return new Error(error.message || 'Unknown error occurred')
    }
  }

  // Generate weekly workout routine
  async generateWeeklyRoutine(userData, workoutHistory = []) {
    try {
      console.log(`🏋️‍♀️ Generating weekly routine for ${userData.name}`)
      
      const response = await this.apiClient.post('/claude-api', {
        action: 'generateWeeklyRoutine',
        userData: {
          ...userData,
          currentStats: this.getCurrentStats(userData),
          startingStats: this.getStartingStats(userData)
        },
        workoutHistory: this.formatWorkoutHistory(workoutHistory)
      })

      if (response.data.success) {
        const routine = response.data.data.routine
        
        // Cache routine locally for offline access
        this.cacheRoutine(userData.id, routine)
        
        return {
          success: true,
          routine: routine.weeklyPlan,
          metadata: {
            progressionNotes: routine.progressionNotes,
            weeklyFocus: routine.weeklyFocus,
            estimatedCalories: routine.estimatedCalories,
            generatedAt: response.data.data.generatedAt,
            model: response.data.data.model
          }
        }
      } else {
        throw new Error(response.data.error || 'Failed to generate routine')
      }
    } catch (error) {
      console.error('Error generating weekly routine:', error)
      
      // Return cached routine or fallback
      return this.getFallbackRoutine(userData)
    }
  }

  // Analyze user progress
  async getProgressAnalysis(userData, progressData) {
    try {
      console.log(`📊 Analyzing progress for ${userData.name}`)
      
      const response = await this.apiClient.post('/claude-api', {
        action: 'analyzeProgress',
        userData: {
          ...userData,
          currentStats: this.getCurrentStats(userData),
          startingStats: this.getStartingStats(userData)
        },
        progressData: this.formatProgressData(progressData)
      })

      if (response.data.success) {
        const analysis = response.data.data.analysis
        
        return {
          success: true,
          progressSummary: analysis.progressSummary,
          goalProgress: analysis.goalProgress,
          strengthProgress: analysis.strengthProgress,
          bodyComposition: analysis.bodyComposition,
          recommendations: analysis.recommendations,
          motivationalMessage: analysis.motivationalMessage,
          analyzedAt: response.data.data.analyzedAt
        }
      } else {
        throw new Error(response.data.error || 'Failed to analyze progress')
      }
    } catch (error) {
      console.error('Error analyzing progress:', error)
      
      // Return basic analysis
      return this.getBasicProgressAnalysis(userData, progressData)
    }
  }

  // Get session feedback
  async getSessionFeedback(userData, sessionData) {
    try {
      console.log(`💬 Getting session feedback for ${userData.name}`)
      
      const response = await this.apiClient.post('/claude-api', {
        action: 'provideFeedback',
        userData,
        sessionData: this.formatSessionData(sessionData)
      })

      if (response.data.success) {
        const feedback = response.data.data.feedback
        
        return {
          success: true,
          sessionRating: feedback.sessionRating,
          achievements: feedback.achievements || [],
          improvements: feedback.improvements || [],
          recoveryTips: feedback.recoveryTips || [],
          nextSessionAdjustments: feedback.nextSessionAdjustments || {},
          motivationalMessage: feedback.motivationalMessage,
          providedAt: response.data.data.providedAt
        }
      } else {
        throw new Error(response.data.error || 'Failed to get feedback')
      }
    } catch (error) {
      console.error('Error getting session feedback:', error)
      
      // Return basic feedback
      return this.getBasicFeedback(userData, sessionData)
    }
  }

  // Helper methods for data formatting
  getCurrentStats(userData) {
    const bodyComposition = userData.bodyComposition || {}
    const measurements = bodyComposition.measurements || []
    const latest = measurements.length > 0 ? measurements[measurements.length - 1] : {}
    
    return {
      weight: latest.weight || userData.demographics?.weight || 0,
      skeletalMuscleMass: latest.skeletalMuscleMass || 0,
      bodyFatPercentage: latest.bodyFatPercentage || 0,
      visceralFat: latest.visceralFat || 0,
      lastUpdated: latest.date || new Date().toISOString()
    }
  }

  getStartingStats(userData) {
    const bodyComposition = userData.bodyComposition || {}
    const measurements = bodyComposition.measurements || []
    const first = measurements.length > 0 ? measurements[0] : {}
    
    return {
      weight: first.weight || userData.demographics?.weight || 0,
      skeletalMuscleMass: first.skeletalMuscleMass || 0,
      bodyFatPercentage: first.bodyFatPercentage || 0,
      visceralFat: first.visceralFat || 0,
      recordedAt: first.date || userData.createdAt || new Date().toISOString()
    }
  }

  formatWorkoutHistory(workoutHistory) {
    return workoutHistory.slice(-10).map(workout => ({
      date: workout.date,
      title: workout.title,
      duration: workout.duration,
      completionPercentage: workout.completionPercentage,
      exercises: workout.exercises || [],
      notes: workout.notes,
      userRating: workout.userRating || null
    }))
  }

  formatProgressData(progressData) {
    return {
      workoutHistory: progressData.workouts || [],
      bodyCompositionHistory: progressData.bodyComposition || [],
      strengthBenchmarks: progressData.strengthBenchmarks || {},
      weeklyConsistency: progressData.weeklyConsistency || {},
      goalMetrics: progressData.goalMetrics || {}
    }
  }

  formatSessionData(sessionData) {
    return {
      workoutTitle: sessionData.title,
      duration: sessionData.duration,
      completionPercentage: sessionData.completionPercentage,
      exercises: sessionData.exercises || [],
      userNotes: sessionData.notes,
      energyLevel: sessionData.energyLevel,
      difficulty: sessionData.difficulty,
      enjoyment: sessionData.enjoyment,
      soreness: sessionData.soreness
    }
  }

  // Caching methods
  cacheRoutine(userId, routine) {
    try {
      const cacheKey = `claude_routine_${userId}`
      const cacheData = {
        routine,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error caching routine:', error)
    }
  }

  getCachedRoutine(userId) {
    try {
      const cacheKey = `claude_routine_${userId}`
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        const cacheData = JSON.parse(cached)
        const now = new Date()
        const expiresAt = new Date(cacheData.expiresAt)
        
        if (now < expiresAt) {
          console.log('📋 Using cached routine')
          return cacheData.routine
        } else {
          localStorage.removeItem(cacheKey)
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting cached routine:', error)
      return null
    }
  }

  // Fallback methods
  getFallbackRoutine(userData) {
    console.log('🔄 Using fallback routine generator')
    
    const cachedRoutine = this.getCachedRoutine(userData.id)
    if (cachedRoutine) {
      return {
        success: true,
        routine: cachedRoutine.weeklyPlan,
        metadata: {
          progressionNotes: 'Using cached routine - will update when connection is restored',
          weeklyFocus: userData.goal === 'muscle_building' ? 'Muscle building focus' : 'Weight loss focus',
          estimatedCalories: userData.goal === 'muscle_building' ? 200 : 300,
          generatedAt: new Date().toISOString(),
          model: 'cached'
        }
      }
    }

    // Generate basic fallback routine
    const isUserA = userData.goal === 'muscle_building'
    
    return {
      success: true,
      routine: this.generateBasicWeeklyPlan(isUserA),
      metadata: {
        progressionNotes: 'Basic routine - will be enhanced when AI is available',
        weeklyFocus: isUserA ? 'Muscle building with progressive overload' : 'Weight loss with metabolic training',
        estimatedCalories: isUserA ? 200 : 300,
        generatedAt: new Date().toISOString(),
        model: 'fallback'
      }
    }
  }

  generateBasicWeeklyPlan(isUserA) {
    const baseReps = isUserA ? '8-12' : '12-18'
    const baseSets = isUserA ? 4 : 3
    const restTime = isUserA ? '90s' : '60s'

    return {
      Monday: {
        title: 'Glutes & Shoulders',
        warmup: [
          { name: 'Light Cardio', duration: '5 min' },
          { name: 'Dynamic Hip Circles', sets: 2, reps: 10 }
        ],
        mainExercises: [
          { name: 'Hip Thrusts', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Bulgarian Split Squats', sets: 3, reps: baseReps, rest: '75s' },
          { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45s' },
          { name: 'Overhead Press', sets: 3, reps: baseReps, rest: restTime }
        ],
        secondaryExercises: [
          { name: 'Clamshells', sets: 3, reps: '15-20', rest: '30s' },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' }
        ],
        cooldown: [
          { name: 'Hip Flexor Stretch', duration: '3 min' },
          { name: 'Shoulder Stretch', duration: '2 min' }
        ]
      },
      Tuesday: {
        title: 'Back & Chest',
        warmup: [
          { name: 'Arm Circles', sets: 2, reps: 15 },
          { name: 'Band Pull-aparts', sets: 2, reps: 15 }
        ],
        mainExercises: [
          { name: 'Lat Pulldown', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Chest Press', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Seated Rows', sets: 3, reps: baseReps, rest: '75s' },
          { name: 'Incline Press', sets: 3, reps: baseReps, rest: '75s' }
        ],
        secondaryExercises: [
          { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', rest: '45s' },
          { name: 'Push-ups', sets: 2, reps: 'To failure', rest: '60s' }
        ],
        cooldown: [
          { name: 'Chest Stretch', duration: '2 min' },
          { name: 'Lat Stretch', duration: '2 min' }
        ]
      },
      Wednesday: {
        title: 'Hips & Arms',
        warmup: [
          { name: 'Leg Swings', sets: 2, reps: 12 },
          { name: 'Arm Swings', sets: 2, reps: 12 }
        ],
        mainExercises: [
          { name: 'Romanian Deadlifts', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Hip Abduction', sets: 3, reps: '15-20', rest: '60s' },
          { name: 'Bicep Curls', sets: 3, reps: baseReps, rest: '60s' },
          { name: 'Tricep Extensions', sets: 3, reps: baseReps, rest: '60s' }
        ],
        secondaryExercises: [
          { name: 'Hammer Curls', sets: 2, reps: '12-15', rest: '45s' },
          { name: 'Diamond Push-ups', sets: 2, reps: 'To failure', rest: '45s' }
        ],
        cooldown: [
          { name: 'Hip Flexor Stretch', duration: '3 min' },
          { name: 'Tricep Stretch', duration: '2 min' }
        ]
      },
      Thursday: {
        title: 'Chest & Back',
        warmup: [
          { name: 'Band Pull-aparts', sets: 2, reps: 15 },
          { name: 'Shoulder Rolls', sets: 2, reps: 10 }
        ],
        mainExercises: [
          { name: 'Bench Press', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Pull-ups/Assisted', sets: 3, reps: baseReps, rest: restTime },
          { name: 'Dumbbell Flyes', sets: 3, reps: '10-15', rest: '75s' },
          { name: 'Cable Rows', sets: 3, reps: baseReps, rest: '75s' }
        ],
        secondaryExercises: [
          { name: 'Plank', sets: 3, duration: '30-60s', rest: '60s' },
          { name: 'Dead Bug', sets: 2, reps: '10 each side', rest: '45s' }
        ],
        cooldown: [
          { name: 'Pec Stretch', duration: '3 min' },
          { name: 'Upper Back Stretch', duration: '2 min' }
        ]
      },
      Friday: {
        title: 'Full Body',
        warmup: [
          { name: 'Full Body Movement', duration: '5 min' },
          { name: 'Dynamic Stretches', duration: '5 min' }
        ],
        mainExercises: [
          { name: 'Squats', sets: baseSets, reps: baseReps, rest: restTime },
          { name: 'Deadlifts', sets: 3, reps: baseReps, rest: restTime },
          { name: 'Push-ups', sets: 3, reps: 'To failure', rest: '75s' },
          { name: 'Bent-over Rows', sets: 3, reps: baseReps, rest: '75s' }
        ],
        secondaryExercises: [
          { name: 'Mountain Climbers', sets: 3, duration: '30s', rest: '60s' },
          { name: 'Burpees', sets: 2, reps: '5-10', rest: '90s' }
        ],
        cooldown: [
          { name: 'Full Body Stretch', duration: '5 min' },
          { name: 'Deep Breathing', duration: '3 min' }
        ]
      },
      Saturday: {
        title: 'Core & Cardio',
        warmup: [
          { name: 'Light Movement', duration: '5 min' }
        ],
        mainExercises: [
          { name: 'Plank Variations', sets: 3, duration: '30-45s', rest: '60s' },
          { name: 'Russian Twists', sets: 3, reps: '15-20', rest: '45s' },
          { name: 'Leg Raises', sets: 3, reps: '10-15', rest: '45s' },
          { name: 'Cardio Circuit', duration: '15-20 min' }
        ],
        secondaryExercises: [
          { name: 'Bird Dog', sets: 2, reps: '8 each side', rest: '45s' }
        ],
        cooldown: [
          { name: 'Core Stretch', duration: '5 min' },
          { name: 'Relaxation', duration: '5 min' }
        ]
      },
      Sunday: {
        title: isUserA ? 'Rest Day' : 'Active Recovery',
        warmup: [
          { name: 'Gentle Movement', duration: '10 min' }
        ],
        mainExercises: isUserA ? [] : [
          { name: 'Light Walk', duration: '20-30 min' },
          { name: 'Gentle Yoga', duration: '15 min' }
        ],
        secondaryExercises: [],
        cooldown: [
          { name: 'Full Body Stretch', duration: '15 min' },
          { name: 'Meditation', duration: '10 min' }
        ]
      }
    }
  }

  getBasicProgressAnalysis(userData, progressData) {
    console.log('📈 Generating basic progress analysis')
    
    const workouts = progressData.workouts || []
    const completedWorkouts = workouts.filter(w => w.status === 'completed')
    const avgCompletion = completedWorkouts.length > 0 
      ? completedWorkouts.reduce((sum, w) => sum + (w.completionPercentage || 0), 0) / completedWorkouts.length
      : 0

    return {
      success: true,
      progressSummary: `You've completed ${completedWorkouts.length} workouts with an average completion rate of ${Math.round(avgCompletion)}%.`,
      goalProgress: {
        percentage: Math.min(avgCompletion * 0.8, 100),
        onTrack: avgCompletion >= 70,
        timeToGoal: userData.goal === 'muscle_building' ? '8-12 weeks' : '4-8 weeks'
      },
      strengthProgress: [],
      bodyComposition: {},
      recommendations: [
        'Keep up the consistent training',
        'Focus on progressive overload',
        'Ensure adequate rest between sessions'
      ],
      motivationalMessage: avgCompletion >= 80 
        ? "Excellent progress! You're crushing your goals!" 
        : "Stay consistent and the results will come!",
      analyzedAt: new Date().toISOString()
    }
  }

  getBasicFeedback(userData, sessionData) {
    console.log('💭 Generating basic session feedback')
    
    const completion = sessionData.completionPercentage || 0
    let rating = 'good'
    
    if (completion >= 90) rating = 'excellent'
    else if (completion >= 70) rating = 'good'
    else if (completion >= 50) rating = 'average'
    else rating = 'needs_improvement'

    return {
      success: true,
      sessionRating: rating,
      achievements: completion >= 70 ? ['Completed most exercises', 'Maintained good form'] : ['Showed up and tried'],
      improvements: completion < 70 ? ['Consider reducing weight or reps', 'Focus on completing more sets'] : [],
      recoveryTips: ['Stay hydrated', 'Get adequate sleep', 'Light stretching tomorrow'],
      nextSessionAdjustments: {},
      motivationalMessage: completion >= 80 
        ? "Amazing workout! You're getting stronger every day!" 
        : "Every workout counts. Keep building momentum!",
      providedAt: new Date().toISOString()
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.apiClient.post('/claude-api', {
        action: 'generateWeeklyRoutine',
        userData: { 
          name: 'Test', 
          goal: 'muscle_building',
          demographics: { age: 25, height: 170, weight: 70 }
        },
        workoutHistory: []
      })
      
      return response.data.success
    } catch (error) {
      console.error('Claude health check failed:', error)
      return false
    }
  }
}

export default new ClaudeService()