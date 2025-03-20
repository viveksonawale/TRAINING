import { progressData } from '../data/progressData';

const STORAGE_KEY = 'fitlife_progress';

// Initialize progress data from localStorage or use default
export const initializeProgress = () => {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  return progressData;
};

// Save progress data to localStorage
export const saveProgress = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Update workout statistics
export const updateWorkoutStats = (workoutType, duration) => {
  const progress = initializeProgress();
  
  // Update total workouts
  progress.statistics.totalWorkouts += 1;
  
  // Update workout type count
  progress.statistics.workoutTypes[workoutType.toLowerCase()] += 1;
  
  // Parse duration to ensure it's a number
  const durationInMinutes = typeof duration === 'string' 
    ? parseInt(duration.replace(/[^0-9]/g, ''), 10) 
    : Number(duration);
  
  // Update total duration only if we have a valid number
  if (!isNaN(durationInMinutes)) {
    progress.statistics.totalDuration += durationInMinutes;
  }
  
  // Update streaks
  const today = new Date();
  const lastWorkout = progress.statistics.lastWorkoutDate 
    ? new Date(progress.statistics.lastWorkoutDate)
    : null;
  
  if (lastWorkout) {
    const daysSinceLastWorkout = Math.floor(
      (today - lastWorkout) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastWorkout === 1) {
      progress.statistics.currentStreak += 1;
      if (progress.statistics.currentStreak > progress.statistics.longestStreak) {
        progress.statistics.longestStreak = progress.statistics.currentStreak;
      }
    } else if (daysSinceLastWorkout > 1) {
      progress.statistics.currentStreak = 1;
    }
  } else {
    progress.statistics.currentStreak = 1;
  }
  
  progress.statistics.lastWorkoutDate = today.toISOString();
  
  // Update weekly and monthly counts
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  if (!progress.statistics.weeklyWorkouts) {
    progress.statistics.weeklyWorkouts = 0;
  }
  if (!progress.statistics.monthlyWorkouts) {
    progress.statistics.monthlyWorkouts = 0;
  }
  
  if (lastWorkout && lastWorkout >= weekStart) {
    progress.statistics.weeklyWorkouts += 1;
  } else {
    progress.statistics.weeklyWorkouts = 1;
  }
  
  if (lastWorkout && lastWorkout >= monthStart) {
    progress.statistics.monthlyWorkouts += 1;
  } else {
    progress.statistics.monthlyWorkouts = 1;
  }
  
  saveProgress(progress);
  return progress;
};

// Update personal record
export const updatePersonalRecord = (exercise, data) => {
  const progress = initializeProgress();
  
  if (!progress.personalRecords.exercises[exercise]) {
    progress.personalRecords.exercises[exercise] = {};
  }
  
  const currentRecord = progress.personalRecords.exercises[exercise];
  
  // Update only if new record is better
  if (data.weight && (!currentRecord.weight || data.weight > currentRecord.weight)) {
    currentRecord.weight = data.weight;
    currentRecord.date = new Date().toISOString();
  }
  
  if (data.reps && (!currentRecord.reps || data.reps > currentRecord.reps)) {
    currentRecord.reps = data.reps;
    currentRecord.date = new Date().toISOString();
  }
  
  if (data.distance && (!currentRecord.distance || data.distance > currentRecord.distance)) {
    currentRecord.distance = data.distance;
    currentRecord.date = new Date().toISOString();
  }
  
  if (data.time && (!currentRecord.time || data.time < currentRecord.time)) {
    currentRecord.time = data.time;
    currentRecord.date = new Date().toISOString();
  }
  
  saveProgress(progress);
  return progress;
};

// Add measurement
export const addMeasurement = (type, value) => {
  const progress = initializeProgress();
  
  if (!progress.measurements[type]) {
    progress.measurements[type] = [];
  }
  
  progress.measurements[type].push({
    value,
    date: new Date().toISOString()
  });
  
  saveProgress(progress);
  return progress;
};

// Add progress photo
export const addProgressPhoto = (photoUrl) => {
  const progress = initializeProgress();
  
  progress.measurements.photos.push({
    url: photoUrl,
    date: new Date().toISOString()
  });
  
  saveProgress(progress);
  return progress;
};

// Update performance metrics
export const updatePerformanceMetric = (category, metric, value) => {
  const progress = initializeProgress();
  
  if (!progress.performance[category]) {
    progress.performance[category] = {};
  }
  
  progress.performance[category][metric] = value;
  
  saveProgress(progress);
  return progress;
};

// Check and update achievements
export const checkAchievements = () => {
  const progress = initializeProgress();
  const achievements = progress.achievements.badges;
  
  // First Workout
  if (progress.statistics.totalWorkouts >= 1 && !achievements.find(a => a.id === 'first_workout').earned) {
    achievements.find(a => a.id === 'first_workout').earned = true;
    achievements.find(a => a.id === 'first_workout').date = new Date().toISOString();
  }
  
  // 7-Day Streak
  if (progress.statistics.currentStreak >= 7 && !achievements.find(a => a.id === 'streak_7').earned) {
    achievements.find(a => a.id === 'streak_7').earned = true;
    achievements.find(a => a.id === 'streak_7').date = new Date().toISOString();
  }
  
  // 30-Day Streak
  if (progress.statistics.currentStreak >= 30 && !achievements.find(a => a.id === 'streak_30').earned) {
    achievements.find(a => a.id === 'streak_30').earned = true;
    achievements.find(a => a.id === 'streak_30').date = new Date().toISOString();
  }
  
  // Strength Master
  if (progress.statistics.workoutTypes.strength >= 50 && !achievements.find(a => a.id === 'strength_master').earned) {
    achievements.find(a => a.id === 'strength_master').earned = true;
    achievements.find(a => a.id === 'strength_master').date = new Date().toISOString();
  }
  
  // Cardio King
  if (progress.statistics.workoutTypes.cardio >= 50 && !achievements.find(a => a.id === 'cardio_king').earned) {
    achievements.find(a => a.id === 'cardio_king').earned = true;
    achievements.find(a => a.id === 'cardio_king').date = new Date().toISOString();
  }
  
  saveProgress(progress);
  return progress;
};

// Add workout to history
export const addWorkoutToHistory = (workout) => {
  const progress = initializeProgress();
  
  progress.workoutHistory.unshift({
    ...workout,
    date: new Date().toISOString()
  });
  
  // Keep only last 100 workouts
  if (progress.workoutHistory.length > 100) {
    progress.workoutHistory = progress.workoutHistory.slice(0, 100);
  }
  
  saveProgress(progress);
  return progress;
};

// Add sample personal record for testing
export const addSamplePersonalRecord = () => {
  const progress = initializeProgress();
  
  // Add or update some sample personal records
  updatePersonalRecord('benchPress', { weight: 225, reps: 8 });
  updatePersonalRecord('squats', { weight: 315, reps: 6 });
  updatePersonalRecord('deadlifts', { weight: 405, reps: 5 });
  updatePersonalRecord('pullUps', { reps: 15 });
  updatePersonalRecord('running', { distance: 5.2, time: 28 });
  
  return initializeProgress(); // Return the updated progress
};

// Add sample data for testing all features
export const addSampleData = () => {
  const progress = initializeProgress();
  
  // Sample workouts
  const workouts = [
    {
      title: "Full Body Strength",
      type: "strength",
      duration: 45,
      difficulty: "medium",
      notes: "Felt good, increased weight on squats"
    },
    {
      title: "HIIT Cardio Session",
      type: "cardio",
      duration: 30,
      difficulty: "hard",
      notes: "Really pushed myself on the intervals"
    },
    {
      title: "Yoga Flow",
      type: "flexibility",
      duration: 40,
      difficulty: "easy",
      notes: "Focused on hip mobility"
    }
  ];
  
  // Add workouts with different dates
  const today = new Date();
  for (let i = 0; i < workouts.length; i++) {
    const workoutDate = new Date(today);
    workoutDate.setDate(today.getDate() - i);
    
    // Update stats
    updateWorkoutStats(workouts[i].type, workouts[i].duration);
    
    // Add to history with different dates
    progress.workoutHistory.unshift({
      ...workouts[i],
      date: workoutDate.toISOString()
    });
  }
  
  // Sample personal records
  updatePersonalRecord('benchPress', { weight: 225, reps: 8 });
  updatePersonalRecord('squats', { weight: 315, reps: 6 });
  updatePersonalRecord('deadlifts', { weight: 405, reps: 5 });
  updatePersonalRecord('pullUps', { reps: 15 });
  updatePersonalRecord('running', { distance: 5.2, time: 28 });
  
  // Sample measurements
  addMeasurement('weight', 175.5);
  addMeasurement('bodyFat', 15.2);
  addMeasurement('chest', 42);
  addMeasurement('waist', 34);
  addMeasurement('arms', 15.5);
  
  // Sample photos
  addProgressPhoto('https://via.placeholder.com/300x400?text=Progress+Photo+1');
  addProgressPhoto('https://via.placeholder.com/300x400?text=Progress+Photo+2');
  
  // Sample performance metrics
  updatePerformanceMetric('endurance', 'running.distance', 10);
  updatePerformanceMetric('endurance', 'running.time', 60);
  updatePerformanceMetric('strength', 'maxWeight', 315);
  updatePerformanceMetric('strength', 'totalVolume', 12000);
  updatePerformanceMetric('flexibility', 'sitAndReach', 12);
  updatePerformanceMetric('recovery', 'restingHeartRate', 58);
  
  // Check for achievements
  checkAchievements();
  
  // Save all changes
  saveProgress(progress);
  
  return initializeProgress(); // Return the updated progress
}; 