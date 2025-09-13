// Workout Service - Handles all workout-related API operations
import apiClient from './apiClient.js';

class WorkoutService {
  // Get today's workout for a user
  async getTodaysWorkout(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get('/sheets-api', {
        sheet: 'workouts',
        userId: userId
      });
      
      // Find today's workout or get the most recent planned workout
      const todaysWorkout = response.data.find(workout => 
        workout.user_id === userId && workout.scheduled_date === today
      );
      
      if (todaysWorkout) {
        // Get exercises for this workout
        const exercises = await this.getWorkoutExercises(todaysWorkout.workout_id);
        return { ...todaysWorkout, exercises };
      }
      
      // Return default workout if none found
      return this.getDefaultTodaysWorkout(userId);
    } catch (error) {
      console.error('Failed to fetch today\'s workout:', error);
      return this.getDefaultTodaysWorkout(userId);
    }
  }

  // Get exercises for a specific workout
  async getWorkoutExercises(workoutId) {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'workout_exercises'
      });
      
      return response.data
        .filter(exercise => exercise.workout_id === workoutId)
        .sort((a, b) => parseInt(a.order_index) - parseInt(b.order_index));
    } catch (error) {
      console.error('Failed to fetch workout exercises:', error);
      return [];
    }
  }

  // Log a workout session
  async logWorkoutSession(userId, sessionData) {
    try {
      const response = await apiClient.post('/sheets-api', {
        sheet: 'workout_sessions',
        data: {
          user_id: userId,
          workout_date: new Date().toISOString().split('T')[0],
          duration_minutes: sessionData.duration,
          completion_percentage: sessionData.completionPercentage,
          session_notes: sessionData.notes || '',
          energy_level: sessionData.energyLevel || 5,
          rpe_average: sessionData.averageRPE || 5,
          exercises_completed: sessionData.exercisesCompleted || 0,
          total_exercises: sessionData.totalExercises || 0,
          created_date: new Date().toISOString().split('T')[0]
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to log workout session:', error);
      throw new Error(`Failed to save workout session: ${error.message}`);
    }
  }

  // Log exercise sets during workout
  async logExerciseSet(userId, exerciseData, setData) {
    try {
      const response = await apiClient.post('/sheets-api', {
        sheet: 'exercise_sets',
        data: {
          user_id: userId,
          exercise_name: exerciseData.name,
          workout_date: new Date().toISOString().split('T')[0],
          set_number: setData.setNumber,
          weight_kg: setData.weight || 0,
          reps: setData.reps || 0,
          rpe: setData.rpe || 5,
          rest_seconds: setData.restTime || 0,
          completed: setData.completed ? 1 : 0,
          created_date: new Date().toISOString().split('T')[0]
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to log exercise set:', error);
      throw new Error(`Failed to save exercise set: ${error.message}`);
    }
  }

  // Get workout history for a user
  async getWorkoutHistory(userId, limit = 10) {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'workout_sessions',
        userId: userId
      });
      
      return response.data
        .filter(session => session.user_id === userId)
        .sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date))
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch workout history:', error);
      return [];
    }
  }

  // Get weekly workout plan
  async getWeeklyPlan(userId) {
    try {
      const weekStart = this.getCurrentWeekStart();
      const weekDays = this.getWeekDays(weekStart);
      
      const response = await apiClient.get('/sheets-api', {
        sheet: 'workouts',
        userId: userId
      });
      
      // Map workouts to days of the week
      const weeklyPlan = {};
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      weekDays.forEach((date, index) => {
        const dayName = dayNames[index];
        const workout = response.data.find(w => 
          w.user_id === userId && w.scheduled_date === date
        );
        
        weeklyPlan[dayName] = workout || this.getDefaultWorkoutForDay(dayName, userId);
      });
      
      return weeklyPlan;
    } catch (error) {
      console.error('Failed to fetch weekly plan:', error);
      return this.getDefaultWeeklyPlan(userId);
    }
  }

  // Default today's workout
  getDefaultTodaysWorkout(userId) {
    return {
      workout_id: 'default-today',
      user_id: userId,
      title: 'Glutes + Shoulders',
      subtitle: 'Lower/Upper Focus',
      scheduled_date: new Date().toISOString().split('T')[0],
      estimated_duration: 65,
      primary_muscle_groups: 'Glutes, Hamstrings',
      secondary_muscle_groups: 'Shoulders, Core',
      exercises: [
        {
          category: 'Warm-up',
          duration: '5-10 min',
          exercises: [
            {
              name: 'Light Cardio',
              sets: [{ details: '5 minutes moderate pace' }]
            }
          ]
        },
        {
          category: 'Primary Exercises',
          duration: '35-40 min',
          exercises: [
            {
              name: 'Romanian Deadlift',
              sets: [
                { details: '20kg × 12 reps (warm-up)' },
                { details: '25kg × 10 reps' },
                { details: '30kg × 8 reps' },
                { details: '25kg × 10 reps (drop)' }
              ]
            },
            {
              name: 'Hip Thrust',
              sets: [
                { details: '35kg × 12 reps' },
                { details: '35kg × 12 reps' },
                { details: '40kg × 10 reps' },
                { details: '40kg × 10 reps' }
              ]
            }
          ]
        }
      ]
    };
  }

  // Default weekly plan
  getDefaultWeeklyPlan(userId) {
    return {
      Monday: {
        title: 'Glutes + Shoulders',
        focus: 'Lower/Upper',
        primaryMuscles: ['Glutes', 'Hamstrings'],
        secondaryMuscles: ['Shoulders', 'Core'],
        summary: 'Romanian deadlifts, hip thrusts, overhead press. Great glute activation session!'
      },
      Tuesday: {
        title: 'Back + Chest',
        focus: 'Pull/Push',
        primaryMuscles: ['Lats', 'Rhomboids'],
        secondaryMuscles: ['Chest', 'Triceps'],
        summary: 'Balanced upper body workout focusing on posture and strength.'
      },
      Wednesday: {
        title: 'Hips/Legs + Arms',
        focus: 'Lower/Arms',
        primaryMuscles: ['Quadriceps', 'Glutes'],
        secondaryMuscles: ['Biceps', 'Triceps'],
        summary: 'Comprehensive leg development with arm finishers.'
      },
      Thursday: {
        title: 'Chest + Back',
        focus: 'Push/Pull',
        primaryMuscles: ['Chest', 'Lats'],
        secondaryMuscles: ['Shoulders', 'Core'],
        summary: 'Upper body strength focus with compound movements.'
      },
      Friday: {
        title: 'Full Body Mix',
        focus: 'Compound',
        primaryMuscles: ['Full Body'],
        secondaryMuscles: ['Core', 'Stabilizers'],
        summary: 'Multi-joint movements for overall strength and conditioning.'
      },
      Saturday: {
        title: 'Core + Light Cardio',
        focus: 'Recovery',
        primaryMuscles: ['Core', 'Abs'],
        secondaryMuscles: ['Hip Flexors', 'Obliques'],
        summary: 'Active recovery with core strengthening and mobility work.'
      },
      Sunday: {
        title: 'Rest Day',
        focus: 'Recovery',
        primaryMuscles: [],
        secondaryMuscles: [],
        summary: 'Complete rest for muscle recovery and growth.'
      }
    };
  }

  // Utility: Get default workout for specific day
  getDefaultWorkoutForDay(dayName, userId) {
    const workouts = this.getDefaultWeeklyPlan(userId);
    return workouts[dayName];
  }

  // Utility: Get current week start (Monday)
  getCurrentWeekStart() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  // Utility: Get all days of current week
  getWeekDays(weekStart) {
    const days = [];
    const start = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    
    return days;
  }
}

export default new WorkoutService();
