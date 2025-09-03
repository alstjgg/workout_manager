// Google Sheets Database API Service
class WorkoutDatabaseAPI {
  constructor() {
    this.SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '1XoJTbee9ndY0Jkr8IHnSH-W0mz5vkuMYe1-Aq2jSrjU';
    this.API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    this.BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}`;
  }

  // ====================
  // CORE API METHODS
  // ====================

  async getSheet(sheetName, range = '') {
    if (!this.API_KEY) {
      console.warn('Google Sheets API key not found. Using fallback data.');
      return this.getFallbackData(sheetName);
    }

    try {
      const url = `${this.BASE_URL}/values/${sheetName}${range ? `!${range}` : ''}?key=${this.API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseSheetData(data.values || []);
    } catch (error) {
      console.error('Error fetching sheet:', error);
      return this.getFallbackData(sheetName);
    }
  }

  async appendToSheet(sheetName, values) {
    if (!this.API_KEY) {
      console.warn('Google Sheets API key not found. Cannot save data.');
      return { success: false, error: 'No API key' };
    }

    try {
      const url = `${this.BASE_URL}/values/${sheetName}:append?valueInputOption=RAW&key=${this.API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [values] })
      });

      if (!response.ok) {
        throw new Error(`Failed to append to ${sheetName}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error appending to sheet:', error);
      throw error;
    }
  }

  async updateSheet(sheetName, range, values) {
    if (!this.API_KEY) {
      console.warn('Google Sheets API key not found. Cannot update data.');
      return { success: false, error: 'No API key' };
    }

    try {
      const url = `${this.BASE_URL}/values/${sheetName}!${range}?valueInputOption=RAW&key=${this.API_KEY}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [values] })
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${sheetName}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating sheet:', error);
      throw error;
    }
  }

  // Convert sheet data to objects with column headers as keys
  parseSheetData(values) {
    if (!values || values.length < 1) return [];
    if (values.length < 2) return []; // Need at least header + 1 data row
    
    const [headers, ...rows] = values;
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  // Fallback data for when API is not available
  getFallbackData(sheetName) {
    const fallbackData = {
      users: [
        {
          user_id: 'A',
          name: 'User A',
          age: '28',
          height_cm: '158',
          current_weight_kg: '48',
          goal: 'muscle_building'
        },
        {
          user_id: 'B',
          name: 'User B',
          age: '27',
          height_cm: '165',
          current_weight_kg: '67',
          goal: 'weight_loss'
        }
      ],
      workouts: [
        {
          workout_id: 'A_2025_09_02_glutes_shoulders',
          user_id: 'A',
          date: '2025-09-02',
          primary_muscle: 'glutes',
          secondary_muscle: 'shoulders',
          status: 'planned'
        }
      ],
      workout_exercises: [
        {
          id: 'A_2025_09_02_primary_1',
          workout_id: 'A_2025_09_02_glutes_shoulders',
          exercise_id: 'romanian_deadlift',
          section: 'primary',
          order_in_section: '1',
          planned_sets: '3',
          planned_reps: '8',
          planned_weight_kg: '15',
          rest_seconds: '90'
        },
        {
          id: 'A_2025_09_02_primary_2',
          workout_id: 'A_2025_09_02_glutes_shoulders',
          exercise_id: 'hip_thrust',
          section: 'primary',
          order_in_section: '2',
          planned_sets: '3',
          planned_reps: '10',
          planned_weight_kg: '20',
          rest_seconds: '75'
        }
      ],
      exercises: [
        {
          exercise_id: 'romanian_deadlift',
          exercise_name: 'Romanian Deadlift',
          primary_muscle: 'glutes',
          equipment: 'barbell'
        },
        {
          exercise_id: 'hip_thrust',
          exercise_name: 'Hip Thrust',
          primary_muscle: 'glutes',
          equipment: 'barbell'
        }
      ]
    };

    return fallbackData[sheetName] || [];
  }

  // ====================
  // USER OPERATIONS
  // ====================

  async getUser(userId) {
    const users = await this.getSheet('users');
    return users.find(user => user.user_id === userId);
  }

  async updateUser(userId, userData) {
    console.log('Update user:', userId, userData);
    // For now, just log the update since we need write permissions
    return { success: true };
  }

  // ====================
  // WORKOUT OPERATIONS
  // ====================

  async createWorkout(workoutData) {
    const workoutId = `${workoutData.user_id}_${workoutData.date}_${workoutData.primary_muscle}_${workoutData.secondary_muscle}`;
    console.log('Create workout:', workoutId);
    return workoutId;
  }

  async getWorkoutsByUser(userId, startDate, endDate) {
    const workouts = await this.getSheet('workouts');
    return workouts.filter(workout => {
      if (workout.user_id !== userId) return false;
      if (startDate && workout.date < startDate) return false;
      if (endDate && workout.date > endDate) return false;
      return true;
    });
  }

  async addExerciseToWorkout(workoutId, exerciseData) {
    console.log('Add exercise to workout:', workoutId, exerciseData);
    return { success: true };
  }

  async getWorkoutExercises(workoutId) {
    const exercises = await this.getSheet('workout_exercises');
    const exerciseDetails = await this.getSheet('exercises');
    
    const workoutExercises = exercises.filter(ex => ex.workout_id === workoutId);
    
    // Enrich with exercise details
    return workoutExercises.map(ex => {
      const details = exerciseDetails.find(detail => detail.exercise_id === ex.exercise_id);
      return {
        ...ex,
        exercise_name: details?.exercise_name || ex.exercise_id.replace(/_/g, ' ')
      };
    }).sort((a, b) => {
      const sectionOrder = { 'warmup': 1, 'dynamic': 2, 'primary': 3, 'secondary': 4, 'cardio': 5, 'cooldown': 6 };
      if (sectionOrder[a.section] !== sectionOrder[b.section]) {
        return sectionOrder[a.section] - sectionOrder[b.section];
      }
      return parseInt(a.order_in_section) - parseInt(b.order_in_section);
    });
  }

  // ====================
  // SESSION TRACKING
  // ====================

  async startWorkoutSession(workoutId, userId) {
    const sessionId = `${userId}_${new Date().toISOString().replace(/[:.]/g, '_')}`;
    console.log('Start workout session:', sessionId);
    return sessionId;
  }

  async completeWorkoutSession(sessionId, sessionData) {
    console.log('Complete workout session:', sessionId, sessionData);
    return { success: true };
  }

  async logExerciseSet(sessionId, exerciseId, setData) {
    console.log('Log exercise set:', sessionId, exerciseId, setData);
    return { success: true };
  }

  // ====================
  // BODY COMPOSITION
  // ====================

  async saveBodyComposition(userId, bodyData) {
    try {
      const measurementId = `${userId}_${bodyData.measurement_date}_${bodyData.measurement_type || 'manual'}`;
      
      await this.appendToSheet('body_measurements', [
        measurementId,
        userId,
        bodyData.measurement_date,
        bodyData.weight_kg,
        bodyData.skeletal_muscle_kg,
        bodyData.body_fat_percentage,
        bodyData.visceral_fat_level,
        bodyData.bmi,
        bodyData.measurement_type || 'manual',
        bodyData.measurement_location || 'gym',
        bodyData.measurement_notes || '',
        new Date().toISOString()
      ]);

      return { success: true };
    } catch (error) {
      console.error('Error saving body composition:', error);
      return { success: false, error: error.message };
    }
  }

  async getBodyCompositionHistory(userId, limit = 10) {
    const measurements = await this.getSheet('body_measurements');
    return measurements
      .filter(m => m.user_id === userId)
      .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date))
      .slice(0, limit);
  }

  // ====================
  // ANALYTICS & REPORTS
  // ====================

  async getWeeklyProgress(userId, weekStart) {
    console.log('Get weekly progress:', userId, weekStart);
    return {
      planned_workouts: 6,
      completed_sessions: 1,
      completion_rate: 16.7,
      total_duration: 75,
      average_rpe: 7
    };
  }

  async getStrengthProgress(userId, exerciseId, limit = 5) {
    console.log('Get strength progress:', userId, exerciseId);
    return [];
  }

  // ====================
  // HIGH-LEVEL HELPERS
  // ====================

  async generateTodaysWorkout(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Try to get existing workout
    let workouts = await this.getWorkoutsByUser(userId, today, today);
    
    if (workouts.length > 0) {
      return workouts[0].workout_id;
    }

    // Return a default workout ID for today
    const dayOfWeek = new Date().toLocaleDateString('en', { weekday: 'lowercase' });
    const workoutTemplate = this.getWorkoutTemplate(dayOfWeek, userId);
    
    return `${userId}_${today}_${workoutTemplate.primary_muscle}_${workoutTemplate.secondary_muscle}`;
  }

  getWorkoutTemplate(dayOfWeek, userId) {
    const templates = {
      monday: { primary_muscle: 'glutes', secondary_muscle: 'shoulders' },
      tuesday: { primary_muscle: 'back', secondary_muscle: 'chest' },
      wednesday: { primary_muscle: 'legs', secondary_muscle: 'arms' },
      thursday: { primary_muscle: 'chest', secondary_muscle: 'back' },
      friday: { primary_muscle: 'full_body', secondary_muscle: 'mixed' },
      saturday: { primary_muscle: 'core', secondary_muscle: 'cardio' },
      sunday: { primary_muscle: 'rest', secondary_muscle: 'recovery' }
    };

    return templates[dayOfWeek] || templates.monday;
  }
}

// React Hook for easy usage
export const useWorkoutDatabase = () => {
  const db = new WorkoutDatabaseAPI();

  return {
    // User operations
    getUser: (userId) => db.getUser(userId),
    updateUser: (userId, data) => db.updateUser(userId, data),

    // Workout operations
    getTodaysWorkout: (userId) => db.generateTodaysWorkout(userId),
    getWorkoutExercises: (workoutId) => db.getWorkoutExercises(workoutId),
    
    // Session tracking
    startSession: (workoutId, userId) => db.startWorkoutSession(workoutId, userId),
    completeSession: (sessionId, data) => db.completeWorkoutSession(sessionId, data),
    logSet: (sessionId, exerciseId, setData) => db.logExerciseSet(sessionId, exerciseId, setData),

    // Body composition
    saveBodyComp: (userId, data) => db.saveBodyComposition(userId, data),
    getBodyHistory: (userId) => db.getBodyCompositionHistory(userId),

    // Analytics
    getWeeklyProgress: (userId, weekStart) => db.getWeeklyProgress(userId, weekStart),
    getStrengthProgress: (userId, exerciseId) => db.getStrengthProgress(userId, exerciseId)
  };
};