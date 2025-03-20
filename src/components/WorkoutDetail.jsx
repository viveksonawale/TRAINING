import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { updateWorkoutStats, addWorkoutToHistory, checkAchievements } from '../utils/progressUtils';

const WorkoutDetail = ({ workout, onClose }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleCompleteWorkout = () => {
    if (isCompleted) return; // Prevent multiple completions

    // Convert workout type to match progress tracking categories
    let workoutType = 'strength';
    if (workout.title.toLowerCase().includes('cardio') || workout.title.toLowerCase().includes('hiit')) {
      workoutType = 'cardio';
    } else if (workout.title.toLowerCase().includes('flexibility') || workout.title.toLowerCase().includes('mobility') || workout.title.toLowerCase().includes('yoga')) {
      workoutType = 'flexibility';
    } else if (workout.title.toLowerCase().includes('hiit')) {
      workoutType = 'hiit';
    }

    // Convert duration string to minutes (e.g., "30 min" -> 30)
    const durationMinutes = parseInt(workout.duration.replace(/\D/g, ''));

    // Create workout data object
    const workoutData = {
      title: workout.title,
      type: workoutType,
      duration: durationMinutes,
      difficulty: workout.level.toLowerCase() === 'beginner' ? 'easy' :
                  workout.level.toLowerCase() === 'advanced' ? 'hard' : 'medium',
      notes: notes
    };

    // Update progress stats
    updateWorkoutStats(workoutType, durationMinutes);
    addWorkoutToHistory(workoutData);
    checkAchievements();

    // Show success message
    setIsCompleted(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="workout-detail-overlay">
      <div className="workout-detail">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="workout-detail-header">
          <h2>{workout.title}</h2>
          <div className="workout-meta">
            <span>{workout.duration}</span>
            <span>•</span>
            <span>{workout.level}</span>
          </div>
          <p className="workout-description">{workout.description}</p>
        </div>

        <div className="workout-exercises">
          <h3>Exercises</h3>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <div className="exercise-header">
                <h4>{exercise.name}</h4>
                <div className="exercise-meta">
                  <span>{exercise.sets} sets</span>
                  <span>•</span>
                  <span>{exercise.reps}</span>
                  <span>•</span>
                  <span>{exercise.duration}</span>
                </div>
              </div>

              <div className="video-placeholder">
                {exercise.videoUrl ? (
                  <div className="video-container">
                    {/* Video player will go here */}
                    <p>Video placeholder</p>
                  </div>
                ) : (
                  <div className="video-placeholder-content">
                    <p>Video coming soon</p>
                  </div>
                )}
              </div>

              <div className="exercise-instructions">
                <h5>Instructions:</h5>
                <pre>{exercise.instructions}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="workout-complete-section">
          {!isCompleted ? (
            <>
              <div className="workout-notes">
                {showNotes ? (
                  <div className="notes-form">
                    <textarea 
                      placeholder="Add notes about your workout (optional)" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <button 
                      className="save-notes-button"
                      onClick={() => setShowNotes(false)}
                    >
                      Save Notes
                    </button>
                  </div>
                ) : (
                  <button 
                    className="add-notes-button"
                    onClick={() => setShowNotes(true)}
                  >
                    Add Notes
                  </button>
                )}
              </div>
              <button 
                className="complete-workout-button"
                onClick={handleCompleteWorkout}
              >
                Complete Workout
              </button>
            </>
          ) : (
            <div className="workout-completed-message">
              <span className="success-icon">✓</span>
              <p>Workout completed! Progress updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

WorkoutDetail.propTypes = {
  workout: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        sets: PropTypes.number.isRequired,
        reps: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        videoUrl: PropTypes.string,
        instructions: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WorkoutDetail; 