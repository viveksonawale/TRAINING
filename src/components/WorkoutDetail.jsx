import React from 'react';
import PropTypes from 'prop-types';

const WorkoutDetail = ({ workout, onClose }) => {
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