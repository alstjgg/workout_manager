import axios from 'axios'

class SheetsService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/.netlify/functions'
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`📤 Sheets API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('📤 Sheets API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        console.log(`📥 Sheets API Response: ${response.status}`)
        return response
      },
      (error) => {
        console.error('📥 Sheets API Error:', error.response?.data || error.message)
        return Promise.reject(this.handleApiError(error))
      }
    )
  }

  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      return new Error(error.response.data?.error || `HTTP ${error.response.status}`)
    } else if (error.request) {
      // Network error
      return new Error('Network error - check your connection')
    } else {
      // Other error
      return new Error(error.message || 'Unknown error occurred')
    }
  }

  // Generic API methods
  async get(sheet, filters = {}) {
    try {
      const response = await this.apiClient.post('/sheets-api', {
        action: 'get',
        sheet,
        filters
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async create(sheet, data) {
    try {
      const response = await this.apiClient.post('/sheets-api', {
        action: 'create',
        sheet,
        data
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async update(sheet, id, data) {
    try {
      const response = await this.apiClient.post('/sheets-api', {
        action: 'update',
        sheet,
        id,
        data
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async delete(sheet, id) {
    try {
      const response = await this.apiClient.post('/sheets-api', {
        action: 'delete',
        sheet,
        id
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // User-specific methods
  async getUserData(userId) {
    try {
      const result = await this.get('users', { id: userId })
      return result.success ? result.data[0] : null
    } catch (error) {
      console.error('Error getting user data:', error)
      throw error
    }
  }

  async createUser(userData) {
    try {
      const result = await this.create('users', userData)
      return result.success ? result.data : null
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(userId, updates) {
    try {
      const result = await this.update('users', userId, updates)
      return result.success ? result.data : null
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Workout methods
  async getWorkoutData(userId, filters = {}) {
    try {
      const result = await this.get('workouts', { user_id: userId, ...filters })
      return result.success ? result.data : []
    } catch (error) {
      console.error('Error getting workout data:', error)
      throw error
    }
  }

  async saveWorkoutSession(sessionData) {
    try {
      const workoutResult = await this.create('workouts', {
        user_id: sessionData.userId,
        title: sessionData.title,
        date: sessionData.date || new Date().toISOString(),
        duration: sessionData.duration,
        completion_percentage: sessionData.completionPercentage || 0,
        status: sessionData.status || 'completed',
        notes: sessionData.notes || ''
      })

      if (!workoutResult.success) {
        throw new Error('Failed to save workout')
      }

      // Save exercise logs if provided
      if (sessionData.exercises && sessionData.exercises.length > 0) {
        const exercisePromises = sessionData.exercises.map(exercise => 
          this.create('exercise_logs', {
            session_id: workoutResult.data.id,
            exercise_id: exercise.id,
            set_number: exercise.setNumber,
            weight: exercise.weight,
            reps: exercise.reps,
            rpe: exercise.rpe,
            completed: exercise.completed,
            timestamp: exercise.timestamp || new Date().toISOString()
          })
        )

        await Promise.all(exercisePromises)
      }

      return workoutResult.data
    } catch (error) {
      console.error('Error saving workout session:', error)
      throw error
    }
  }

  async getWorkoutSessions(userId, startDate = null, endDate = null) {
    try {
      const filters = { user_id: userId }
      
      if (startDate) {
        filters.start_date = startDate
      }
      if (endDate) {
        filters.end_date = endDate
      }

      const result = await this.get('workout_sessions', filters)
      return result.success ? result.data : []
    } catch (error) {
      console.error('Error getting workout sessions:', error)
      throw error
    }
  }

  // Body composition methods
  async updateBodyComposition(userId, measurements) {
    try {
      const result = await this.create('body_measurements', {
        user_id: userId,
        date: measurements.date || new Date().toISOString(),
        weight: measurements.weight,
        skeletal_muscle_mass: measurements.skeletalMuscleMass,
        body_fat_percentage: measurements.bodyFatPercentage,
        visceral_fat: measurements.visceralFat,
        notes: measurements.notes || ''
      })

      return result.success ? result.data : null
    } catch (error) {
      console.error('Error updating body composition:', error)
      throw error
    }
  }

  async getBodyCompositionHistory(userId, limit = 10) {
    try {
      const result = await this.get('body_measurements', { user_id: userId })
      
      if (result.success) {
        // Sort by date (most recent first) and limit results
        return result.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit)
      }
      
      return []
    } catch (error) {
      console.error('Error getting body composition history:', error)
      throw error
    }
  }

  // Weekly status methods
  async updateWeeklyStatus(userId, weekStart, dayStatuses) {
    try {
      // First try to get existing record
      const existing = await this.get('weekly_status', { 
        user_id: userId, 
        week_start: weekStart 
      })

      if (existing.success && existing.data.length > 0) {
        // Update existing record
        const result = await this.update('weekly_status', existing.data[0].id, dayStatuses)
        return result.success ? result.data : null
      } else {
        // Create new record
        const result = await this.create('weekly_status', {
          user_id: userId,
          week_start: weekStart,
          ...dayStatuses
        })
        return result.success ? result.data : null
      }
    } catch (error) {
      console.error('Error updating weekly status:', error)
      throw error
    }
  }

  async getWeeklyStatus(userId, weekStart) {
    try {
      const result = await this.get('weekly_status', { 
        user_id: userId, 
        week_start: weekStart 
      })
      
      return result.success && result.data.length > 0 ? result.data[0] : null
    } catch (error) {
      console.error('Error getting weekly status:', error)
      throw error
    }
  }

  // Data synchronization
  async syncUserData(userId, localData) {
    try {
      console.log(`🔄 Syncing data for user ${userId}`)
      
      const syncResults = {
        workouts: 0,
        bodyComposition: 0,
        weeklyStatus: 0,
        errors: []
      }

      // Sync workouts
      if (localData.workouts && localData.workouts.length > 0) {
        try {
          const workoutPromises = localData.workouts.map(workout => this.create('workouts', workout))
          const results = await Promise.allSettled(workoutPromises)
          syncResults.workouts = results.filter(r => r.status === 'fulfilled').length
        } catch (error) {
          syncResults.errors.push(`Workouts: ${error.message}`)
        }
      }

      // Sync body composition
      if (localData.bodyComposition && localData.bodyComposition.length > 0) {
        try {
          const bodyPromises = localData.bodyComposition.map(measurement => 
            this.create('body_measurements', measurement)
          )
          const results = await Promise.allSettled(bodyPromises)
          syncResults.bodyComposition = results.filter(r => r.status === 'fulfilled').length
        } catch (error) {
          syncResults.errors.push(`Body composition: ${error.message}`)
        }
      }

      console.log('✅ Sync completed:', syncResults)
      return syncResults

    } catch (error) {
      console.error('❌ Sync failed:', error)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.apiClient.post('/sheets-api', {
        action: 'get',
        sheet: 'users',
        filters: { id: 'health-check' }
      })
      
      return response.data.success
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export default new SheetsService()