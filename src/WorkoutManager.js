import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, BarChart3, User, Calendar, Settings, Target, TrendingUp, Clock, Flame, X } from 'lucide-react';

const WorkoutManager = () => {
  const [currentUser, setCurrentUser] = useState('A');
  const [currentView, setCurrentView] = useState('today');
  const [showBodyCompModal, setShowBodyCompModal] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    A: {
      name: 'User A',
      goal: 'Muscle Building',
      todayWorkout: {
        date: '2025-09-02',
        focus: 'Glutes + Shoulders',
        warmup: [
          { name: 'General Movement', duration: '3 min', completed: false, description: 'Light walking, arm circles' },
          { name: 'Glute Activation', duration: '3 min', completed: false, description: 'Clamshells, glute bridges' },
          { name: 'Shoulder Activation', duration: '2 min', completed: false, description: 'Band pull-aparts, arm swings' }
        ],
        dynamicStretch: [
          { name: 'Hip Circles', reps: '10 each direction', completed: false },
          { name: 'Leg Swings', reps: '10 each leg', completed: false },
          { name: 'Arm Circles', reps: '10 each direction', completed: false },
          { name: 'Hip Flexor Stretch', duration: '30 sec each', completed: false }
        ],
        primaryExercises: [
          { name: 'Romanian Deadlift', weight: '15kg', reps: 8, sets: 3, completed: [false, false, false], restTime: '90 sec', notes: ['', '', ''] },
          { name: 'Hip Thrust', weight: '20kg', reps: 10, sets: 3, completed: [false, false, false], restTime: '90 sec', notes: ['', '', ''] },
          { name: 'Bulgarian Split Squat', weight: '8kg', reps: 10, sets: 3, completed: [false, false, false], restTime: '75 sec', notes: ['', '', ''] }
        ],
        secondaryExercises: [
          { name: 'Lateral Raises', weight: '5kg', reps: 12, sets: 3, completed: [false, false, false], restTime: '60 sec', notes: ['', '', ''] },
          { name: 'Rear Delt Flyes', weight: '4kg', reps: 15, sets: 3, completed: [false, false, false], restTime: '60 sec', notes: ['', '', ''] },
          { name: 'Overhead Press', weight: '8kg', reps: 10, sets: 2, completed: [false, false], restTime: '90 sec', notes: ['', ''] }
        ],
        cooldown: [
          { name: 'Hip Flexor Stretch', duration: '60 sec each', completed: false },
          { name: 'Pigeon Pose', duration: '60 sec each', completed: false },
          { name: 'Shoulder Cross Stretch', duration: '30 sec each', completed: false },
          { name: 'Cat-Cow Stretch', duration: '60 sec', completed: false }
        ]
      },
      weeklyPlan: {
        Monday: { primary: 'Glutes', secondary: 'Shoulders', status: 'active', duration: '75 min' },
        Tuesday: { primary: 'Back', secondary: 'Chest', status: 'planned', duration: '80 min' },
        Wednesday: { primary: 'Hips/Legs', secondary: 'Arms', status: 'planned', duration: '75 min' },
        Thursday: { primary: 'Chest', secondary: 'Back', status: 'planned', duration: '80 min' },
        Friday: { primary: 'Full Body', secondary: 'Mixed', status: 'planned', duration: '70 min' },
        Saturday: { primary: 'Core/Functional', secondary: 'Cardio', status: 'planned', duration: '45 min' },
        Sunday: { primary: 'Rest', secondary: 'Recovery', status: 'planned', duration: '0 min' }
      },
      stats: {
        weight: '48kg',
        muscle: 'TBD',
        bodyFat: 'TBD',
        weeklyGoal: '+0.5kg muscle/month'
      }
    },
    B: {
      name: 'User B',
      goal: 'Weight Loss',
      todayWorkout: {
        date: '2025-09-02',
        focus: 'Glutes + Shoulders',
        warmup: [
          { name: 'Cardio Warm-up', duration: '5 min', completed: false, description: 'Light treadmill walk' },
          { name: 'Glute Activation', duration: '3 min', completed: false, description: 'Hip abduction pulses' },
          { name: 'Joint Mobility', duration: '2 min', completed: false, description: 'Shoulder rolls, hip circles' }
        ],
        dynamicStretch: [
          { name: 'Walking High Knees', reps: '20 steps', completed: false },
          { name: 'Leg Swings', reps: '12 each leg', completed: false },
          { name: 'Arm Swings', reps: '15 each direction', completed: false },
          { name: 'Butt Kicks', reps: '20 steps', completed: false }
        ],
        primaryExercises: [
          { name: 'Romanian Deadlift', weight: '20kg', reps: 12, sets: 4, completed: [false, false, false, false], restTime: '75 sec', notes: ['', '', '', ''] },
          { name: 'Hip Abduction', weight: '30kg', reps: 15, sets: 4, completed: [false, false, false, false], restTime: '60 sec', notes: ['', '', '', ''] },
          { name: 'Goblet Squat', weight: '12kg', reps: 15, sets: 3, completed: [false, false, false], restTime: '60 sec', notes: ['', '', ''] }
        ],
        secondaryExercises: [
          { name: 'Shoulder Press', weight: '8kg', reps: 15, sets: 3, completed: [false, false, false], restTime: '45 sec', notes: ['', '', ''] },
          { name: 'Lateral Raises', weight: '4kg', reps: 20, sets: 3, completed: [false, false, false], restTime: '45 sec', notes: ['', '', ''] }
        ],
        cardioFinisher: [
          { name: 'Treadmill Intervals', duration: '10 min', completed: false, description: '1 min fast / 1 min recovery' },
          { name: 'Stair Climber', duration: '5 min', completed: false, description: 'Moderate intensity' }
        ],
        cooldown: [
          { name: 'Walking Cool-down', duration: '3 min', completed: false },
          { name: 'Hip Flexor Stretch', duration: '45 sec each', completed: false },
          { name: 'Shoulder Stretch', duration: '30 sec each', completed: false },
          { name: 'Hamstring Stretch', duration: '45 sec each', completed: false }
        ]
      },
      weeklyPlan: {
        Monday: { primary: 'Glutes', secondary: 'Shoulders', status: 'active', duration: '90 min' },
        Tuesday: { primary: 'Back', secondary: 'Chest', status: 'planned', duration: '85 min' },
        Wednesday: { primary: 'Hips/Legs', secondary: 'Arms', status: 'planned', duration: '90 min' },
        Thursday: { primary: 'Chest', secondary: 'Back', status: 'planned', duration: '85 min' },
        Friday: { primary: 'Full Body', secondary: 'Cardio', status: 'planned', duration: '80 min' },
        Saturday: { primary: 'HIIT/Core', secondary: 'Functional', status: 'planned', duration: '60 min' },
        Sunday: { primary: 'Active Recovery', secondary: 'Light Walk', status: 'planned', duration: '30 min' }
      },
      stats: {
        weight: '67kg',
        muscle: 'TBD',
        bodyFat: 'TBD',
        weeklyGoal: '-1.75kg/week'
      }
    }
  });

  const [sessionData, setSessionData] = useState({
    duration: '',
    rpe: '',
    energyLevel: '',
    notes: ''
  });

  const [bodyCompData, setBodyCompData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    skeletalMuscle: '',
    bodyFat: '',
    visceralFat: '',
    bmi: '',
    notes: ''
  });

  // Save data to localStorage for persistence
  useEffect(() => {
    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
      setWorkoutData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
  }, [workoutData]);

  const toggleSet = (section, exerciseIndex, setIndex = null) => {
    setWorkoutData(prev => {
      const updated = { ...prev };
      const workout = updated[currentUser].todayWorkout;
      
      if (setIndex !== null) {
        workout[section][exerciseIndex].completed[setIndex] = !workout[section][exerciseIndex].completed[setIndex];
      } else {
        workout[section][exerciseIndex].completed = !workout[section][exerciseIndex].completed;
      }
      return updated;
    });
  };

  const updateExerciseNote = (section, exerciseIndex, setIndex, note) => {
    setWorkoutData(prev => {
      const updated = { ...prev };
      if (updated[currentUser].todayWorkout[section][exerciseIndex].notes) {
        updated[currentUser].todayWorkout[section][exerciseIndex].notes[setIndex] = note;
      }
      return updated;
    });
  };

  const updateSessionData = (field, value) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const updateBodyCompData = (field, value) => {
    setBodyCompData(prev => ({ ...prev, [field]: value }));
  };

  const saveBodyComposition = () => {
    setWorkoutData(prev => {
      const updated = { ...prev };
      updated[currentUser].stats = {
        ...updated[currentUser].stats,
        weight: bodyCompData.weight + 'kg',
        muscle: bodyCompData.skeletalMuscle + 'kg',
        bodyFat: bodyCompData.bodyFat + '%'
      };
      return updated;
    });
    
    // Here you would integrate with Google Sheets API
    alert(`Body composition data saved for ${getCurrentUserData().name}! Data will sync to Google Sheets.`);
    setShowBodyCompModal(false);
    
    setBodyCompData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      skeletalMuscle: '',
      bodyFat: '',
      visceralFat: '',
      bmi: '',
      notes: ''
    });
  };

  const saveToDatabase = async () => {
    // Here you would integrate with Google Sheets API
    alert('Workout data saved! This would sync to Google Sheets in the full version.');
  };

  const generateNewWorkout = () => {
    // Here you would integrate with Claude API for workout generation
    alert('This would generate tomorrow\'s workout based on today\'s performance!');
  };

  const getCurrentUserData = () => workoutData[currentUser];

  const getCompletedSets = (exercise) => {
    if (Array.isArray(exercise.completed)) {
      return exercise.completed.filter(set => set).length;
    }
    return exercise.completed ? 1 : 0;
  };

  const getTotalSets = (exercise) => {
    if (exercise.sets) return exercise.sets;
    return Array.isArray(exercise.completed) ? exercise.completed.length : 1;
  };

  const getWorkoutProgress = () => {
    const user = getCurrentUserData();
    const workout = user.todayWorkout;
    
    let totalItems = 0;
    let completedItems = 0;
    
    if (workout.warmup) {
      totalItems += workout.warmup.length;
      completedItems += workout.warmup.filter(item => item.completed).length;
    }
    
    if (workout.dynamicStretch) {
      totalItems += workout.dynamicStretch.length;
      completedItems += workout.dynamicStretch.filter(item => item.completed).length;
    }
    
    if (workout.primaryExercises) {
      workout.primaryExercises.forEach(ex => {
        totalItems += ex.sets;
        completedItems += ex.completed.filter(set => set).length;
      });
    }
    
    if (workout.secondaryExercises) {
      workout.secondaryExercises.forEach(ex => {
        totalItems += ex.sets;
        completedItems += ex.completed.filter(set => set).length;
      });
    }
    
    if (workout.cardioFinisher) {
      totalItems += workout.cardioFinisher.length;
      completedItems += workout.cardioFinisher.filter(item => item.completed).length;
    }
    
    if (workout.cooldown) {
      totalItems += workout.cooldown.length;
      completedItems += workout.cooldown.filter(item => item.completed).length;
    }
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const renderWorkoutSection = (title, items, section, icon, bgColor = "bg-white") => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className={`${bgColor} border border-gray-200 rounded-lg p-4 shadow-sm`}>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
        
        <div className="space-y-2">
          {items.map((item, index) => {
            if (item.sets) {
              return (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getCompletedSets(item)}/{getTotalSets(item)} sets
                      </span>
                      {item.restTime && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.restTime}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {Array.from({ length: item.sets }, (_, setIndex) => (
                      <div 
                        key={setIndex} 
                        className={`flex items-center justify-between p-2 rounded border transition-all cursor-pointer ${
                          item.completed[setIndex] 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => toggleSet(section, index, setIndex)}
                      >
                        <div className="flex items-center space-x-2">
                          {item.completed[setIndex] ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm font-mono">
                            Set {setIndex + 1}: {item.weight} × {item.reps}
                          </span>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Notes..."
                          value={item.notes ? item.notes[setIndex] || '' : ''}
                          onChange={(e) => updateExerciseNote(section, index, setIndex, e.target.value)}
                          className="text-xs bg-transparent border-none outline-none text-gray-600 w-20"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleSet(section, index)}
                >
                  <div className="flex items-center space-x-3">
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      {item.duration && (
                        <span className="text-sm text-blue-600 ml-2">({item.duration})</span>
                      )}
                      {item.reps && (
                        <span className="text-sm text-blue-600 ml-2">({item.reps})</span>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const renderBodyCompositionModal = () => {
    if (!showBodyCompModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Body Composition Analysis</h2>
            <button 
              onClick={() => setShowBodyCompModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={bodyCompData.date}
                onChange={(e) => updateBodyCompData('date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="67.5"
                  value={bodyCompData.weight}
                  onChange={(e) => updateBodyCompData('weight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skeletal Muscle (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="25.3"
                  value={bodyCompData.skeletalMuscle}
                  onChange={(e) => updateBodyCompData('skeletalMuscle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="22.4"
                  value={bodyCompData.bodyFat}
                  onChange={(e) => updateBodyCompData('bodyFat', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visceral Fat</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="3.5"
                  value={bodyCompData.visceralFat}
                  onChange={(e) => updateBodyCompData('visceralFat', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <input
                type="number"
                step="0.1"
                placeholder="24.6"
                value={bodyCompData.bmi}
                onChange={(e) => updateBodyCompData('bmi', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                placeholder="InBody scan at gym, morning measurement..."
                value={bodyCompData.notes}
                onChange={(e) => updateBodyCompData('notes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="2"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowBodyCompModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBodyComposition}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const user = getCurrentUserData();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Weekly Overview</h2>
          <p className="text-indigo-100">Week of September 2-8, 2025</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {days.map(day => {
            const dayPlan = user.weeklyPlan[day];
            const isToday = day === 'Monday';
            
            return (
              <div 
                key={day}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isToday 
                    ? 'border-blue-500 bg-blue-50' 
                    : dayPlan.status === 'completed'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900">{day}</h3>
                      {isToday && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">TODAY</span>}
                      {dayPlan.status === 'completed' && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">DONE</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{dayPlan.primary}</span>
                      {dayPlan.secondary !== dayPlan.primary && (
                        <span className="text-gray-500"> + {dayPlan.secondary}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{dayPlan.duration}</p>
                    <p className="text-xs text-gray-500">
                      {dayPlan.status === 'active' ? 'In Progress' : 
                       dayPlan.status === 'completed' ? 'Completed' : 'Planned'}
                    </p>
                  </div>
                </div>
                
                {isToday && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Progress: {getWorkoutProgress()}%</span>
                      <button 
                        onClick={() => setCurrentView('today')}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Continue Workout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Week Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Sessions This Week</p>
              <p className="font-bold text-gray-900">1 / 6</p>
            </div>
            <div>
              <p className="text-gray-600">Total Duration</p>
              <p className="font-bold text-gray-900">0 / 455 min</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTodayWorkout = () => {
    const user = getCurrentUserData();
    const workout = user.todayWorkout;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">{workout.focus}</h2>
          <p className="text-purple-100">{workout.date} • Progress: {getWorkoutProgress()}%</p>
        </div>

        {renderWorkoutSection("Warm-up", workout.warmup, "warmup", "🔥", "bg-yellow-50")}
        {renderWorkoutSection("Dynamic Stretching", workout.dynamicStretch, "dynamicStretch", "🤸", "bg-orange-50")}
        {renderWorkoutSection("Primary Exercises", workout.primaryExercises, "primaryExercises", "💪")}
        {renderWorkoutSection("Secondary Exercises", workout.secondaryExercises, "secondaryExercises", "🎯")}
        {workout.cardioFinisher && renderWorkoutSection("Cardio Finisher", workout.cardioFinisher, "cardioFinisher", "⚡", "bg-red-50")}
        {renderWorkoutSection("Cool-down & Stretching", workout.cooldown, "cooldown", "🧘", "bg-blue-50")}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">📊 Session Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="Duration (min)"
              value={sessionData.duration}
              onChange={(e) => updateSessionData('duration', e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <input 
              type="number" 
              placeholder="RPE (1-10)"
              value={sessionData.rpe}
              onChange={(e) => updateSessionData('rpe', e.target.value)}
              min="1" max="10"
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mt-3">
            <textarea 
              placeholder="How did the workout feel? Any struggles or wins?"
              value={sessionData.notes}
              onChange={(e) => updateSessionData('notes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="2"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={saveToDatabase}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save to Database
          </button>
          <button 
            onClick={generateNewWorkout}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Generate Next Workout
          </button>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    const user = getCurrentUserData();
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">{user.name} Progress</h2>
          <p className="text-blue-100">Goal: {user.goal}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Current Weight</h3>
            <p className="text-2xl font-bold text-gray-900">{user.stats.weight}</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-1">Muscle Mass</h3>
            <p className="text-2xl font-bold text-gray-900">{user.stats.muscle}</p>
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Body Composition</h3>
            <button 
              onClick={() => setShowBodyCompModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Data
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Body Fat</p>
              <p className="font-bold text-gray-900">{user.stats.bodyFat}</p>
            </div>
            <div>
              <p className="text-gray-600">Weekly Goal</p>
              <p className="font-bold text-gray-900">{user.stats.weeklyGoal}</p>
            </div>
          </div>
        </div>

        {(user.stats.weight.includes('TBD') || user.stats.muscle.includes('TBD')) && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Baseline Data Needed</h3>
            <p className="text-yellow-700 mb-3">To get personalized recommendations, we need:</p>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• InBody scan for body composition</li>
              <li>• Strength testing for major exercises</li>
              <li>• Movement assessment</li>
            </ul>
            <div className="flex space-x-2 mt-3">
              <button 
                onClick={() => setShowBodyCompModal(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
              >
                Add Body Composition
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Schedule Strength Test
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Recent Progress</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-medium">1 / 6 sessions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update</span>
              <span className="font-medium">Today</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-900 text-center">Workout Manager</h1>
        
        <div className="flex bg-gray-100 rounded-lg p-1 mt-3">
          <button 
            onClick={() => setCurrentUser('A')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              currentUser === 'A' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            User A
          </button>
          <button 
            onClick={() => setCurrentUser('B')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              currentUser === 'B' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            User B
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-6">
          <button 
            onClick={() => setCurrentView('today')}
            className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
              currentView === 'today' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Today</span>
          </button>
          <button 
            onClick={() => setCurrentView('weekly')}
            className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
              currentView === 'weekly' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="font-medium">Week</span>
          </button>
          <button 
            onClick={() => setCurrentView('stats')}
            className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
              currentView === 'stats' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Progress</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {currentView === 'today' && renderTodayWorkout()}
        {currentView === 'weekly' && renderWeeklyView()}
        {currentView === 'stats' && renderStats()}
      </div>

      {renderBodyCompositionModal()}
    </div>
  );
};

export default WorkoutManager;