// User Service - Handles all user-related API operations
import apiClient from './apiClient.js';

class UserService {
  // Get user profile by ID
  async getUser(userId) {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'users',
        userId: userId
      });
      
      return response.data[0] || null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error(`Failed to load user ${userId}: ${error.message}`);
    }
  }

  // Get both users
  async getAllUsers() {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'users'
      });
      
      // Return only users A and B, filter out empty rows
      return response.data.filter(user => 
        user.user_id && ['A', 'B'].includes(user.user_id)
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error(`Failed to load users: ${error.message}`);
    }
  }

  // Update user profile
  async updateUser(userId, updates) {
    try {
      const response = await apiClient.put('/sheets-api', {
        sheet: 'users',
        filters: { user_id: userId },
        data: {
          ...updates,
          last_updated: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error(`Failed to update user ${userId}: ${error.message}`);
    }
  }

  // Get user's current week status
  async getWeeklyStatus(userId) {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'weekly_status',
        userId: userId,
        action: 'weekly_status'
      });
      
      return response.data[0] || this.getDefaultWeeklyStatus(userId);
    } catch (error) {
      console.error('Failed to fetch weekly status:', error);
      // Return default status on error
      return this.getDefaultWeeklyStatus(userId);
    }
  }

  // Update weekly status
  async updateWeeklyStatus(userId, statusUpdates) {
    try {
      const currentWeek = this.getCurrentWeekStart();
      
      const response = await apiClient.post('/sheets-api', {
        sheet: 'weekly_status',
        data: {
          user_id: userId,
          week_start_date: currentWeek,
          monday: statusUpdates.Monday || 'planned',
          tuesday: statusUpdates.Tuesday || 'planned',
          wednesday: statusUpdates.Wednesday || 'planned',
          thursday: statusUpdates.Thursday || 'planned',
          friday: statusUpdates.Friday || 'planned',
          saturday: statusUpdates.Saturday || 'planned',
          sunday: statusUpdates.Sunday || 'rest',
          created_date: new Date().toISOString().split('T')[0]
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to update weekly status:', error);
      throw new Error(`Failed to update weekly status: ${error.message}`);
    }
  }

  // Get user's body measurements history
  async getBodyMeasurements(userId, limit = 10) {
    try {
      const response = await apiClient.get('/sheets-api', {
        sheet: 'body_measurements',
        userId: userId
      });
      
      // Sort by date and limit results
      const measurements = response.data
        .filter(row => row.user_id === userId && row.measurement_date)
        .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date))
        .slice(0, limit);
      
      return measurements;
    } catch (error) {
      console.error('Failed to fetch body measurements:', error);
      throw new Error(`Failed to load body measurements: ${error.message}`);
    }
  }

  // Add new body measurement
  async addBodyMeasurement(userId, measurementData) {
    try {
      const response = await apiClient.post('/sheets-api', {
        sheet: 'body_measurements',
        data: {
          user_id: userId,
          measurement_date: measurementData.date || new Date().toISOString().split('T')[0],
          weight_kg: measurementData.weight,
          muscle_mass_kg: measurementData.muscle_mass,
          body_fat_percentage: measurementData.body_fat,
          visceral_fat_level: measurementData.visceral_fat,
          created_date: new Date().toISOString().split('T')[0]
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to add body measurement:', error);
      throw new Error(`Failed to save body measurement: ${error.message}`);
    }
  }

  // Utility: Get default weekly status
  getDefaultWeeklyStatus(userId) {
    return {
      user_id: userId,
      week_start_date: this.getCurrentWeekStart(),
      monday: 'planned',
      tuesday: 'today',
      wednesday: 'planned',
      thursday: 'planned',
      friday: 'planned',
      saturday: 'planned',
      sunday: 'rest'
    };
  }

  // Utility: Get current week start date (Monday)
  getCurrentWeekStart() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  // Get progress data for charts (last 4 measurements)
  async getProgressData(userId) {
    try {
      const measurements = await this.getBodyMeasurements(userId, 4);
      
      if (measurements.length === 0) {
        return this.getDefaultProgressData(userId);
      }

      // Convert to chart format
      const latest = measurements[0];
      const previous = measurements[1];
      
      const calculateChange = (current, prev) => {
        if (!prev) return 0;
        return parseFloat((parseFloat(current) - parseFloat(prev)).toFixed(1));
      };

      return {
        weight: {
          current: `${latest.weight_kg}kg`,
          change: previous ? `${calculateChange(latest.weight_kg, previous.weight_kg) >= 0 ? '+' : ''}${calculateChange(latest.weight_kg, previous.weight_kg)}kg` : '0kg',
          trend: previous ? (parseFloat(latest.weight_kg) > parseFloat(previous.weight_kg) ? 'up' : parseFloat(latest.weight_kg) < parseFloat(previous.weight_kg) ? 'down' : 'stable') : 'stable',
          history: measurements.reverse().map(m => parseFloat(m.weight_kg))
        },
        muscle: {
          current: `${latest.muscle_mass_kg}kg`,
          change: previous ? `${calculateChange(latest.muscle_mass_kg, previous.muscle_mass_kg) >= 0 ? '+' : ''}${calculateChange(latest.muscle_mass_kg, previous.muscle_mass_kg)}kg` : '0kg',
          trend: previous ? (parseFloat(latest.muscle_mass_kg) > parseFloat(previous.muscle_mass_kg) ? 'up' : parseFloat(latest.muscle_mass_kg) < parseFloat(previous.muscle_mass_kg) ? 'down' : 'stable') : 'stable',
          history: measurements.map(m => parseFloat(m.muscle_mass_kg))
        },
        bodyFat: {
          current: `${latest.body_fat_percentage}%`,
          change: previous ? `${calculateChange(latest.body_fat_percentage, previous.body_fat_percentage) >= 0 ? '+' : ''}${calculateChange(latest.body_fat_percentage, previous.body_fat_percentage)}%` : '0%',
          trend: previous ? (parseFloat(latest.body_fat_percentage) > parseFloat(previous.body_fat_percentage) ? 'up' : parseFloat(latest.body_fat_percentage) < parseFloat(previous.body_fat_percentage) ? 'down' : 'stable') : 'stable',
          history: measurements.map(m => parseFloat(m.body_fat_percentage))
        },
        visceral: {
          current: latest.visceral_fat_level,
          change: previous ? (parseInt(latest.visceral_fat_level) - parseInt(previous.visceral_fat_level)).toString() : '0',
          trend: previous ? (parseInt(latest.visceral_fat_level) > parseInt(previous.visceral_fat_level) ? 'up' : parseInt(latest.visceral_fat_level) < parseInt(previous.visceral_fat_level) ? 'down' : 'stable') : 'stable',
          history: measurements.map(m => parseInt(m.visceral_fat_level))
        }
      };
    } catch (error) {
      console.error('Failed to get progress data:', error);
      return this.getDefaultProgressData(userId);
    }
  }

  // Default progress data for new users
  getDefaultProgressData(userId) {
    const isUserA = userId === 'A';
    
    return {
      weight: {
        current: isUserA ? '48.0kg' : '67.0kg',
        change: '0kg',
        trend: 'stable',
        history: isUserA ? [48.0, 48.0, 48.0, 48.0] : [67.0, 67.0, 67.0, 67.0]
      },
      muscle: {
        current: isUserA ? '22.0kg' : '26.0kg',
        change: '0kg',
        trend: 'stable',
        history: isUserA ? [22.0, 22.0, 22.0, 22.0] : [26.0, 26.0, 26.0, 26.0]
      },
      bodyFat: {
        current: isUserA ? '18.0%' : '28.0%',
        change: '0%',
        trend: 'stable',
        history: isUserA ? [18.0, 18.0, 18.0, 18.0] : [28.0, 28.0, 28.0, 28.0]
      },
      visceral: {
        current: isUserA ? '2' : '4',
        change: '0',
        trend: 'stable',
        history: isUserA ? [2, 2, 2, 2] : [4, 4, 4, 4]
      }
    };
  }
}

export default new UserService();
