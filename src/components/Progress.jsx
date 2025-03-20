import React, { useState, useEffect } from 'react';
import { progressData } from '../data/progressData';
import {
  initializeProgress,
  updateWorkoutStats,
  updatePersonalRecord,
  addMeasurement,
  addProgressPhoto,
  updatePerformanceMetric,
  checkAchievements,
  addWorkoutToHistory,
  resetProgress,
  addSampleData
} from '../utils/progressUtils';
import './Progress.css';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [progress, setProgress] = useState(progressData);
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedProgress = initializeProgress();
    setProgress(savedProgress);
  }, []);

  const handleAddTestData = () => {
    if (window.confirm('Do you want to add sample data for testing all progress features?')) {
      const updatedData = addSampleData();
      setProgress(updatedData);
    }
  };

  const handleWorkoutComplete = (workout) => {
    const updatedProgress = updateWorkoutStats(workout.type, workout.duration);
    addWorkoutToHistory(workout);
    checkAchievements();
    setProgress(updatedProgress);
  };

  const handleUpdatePR = (exercise, data) => {
    const updatedProgress = updatePersonalRecord(exercise, data);
    setProgress(updatedProgress);
  };

  const handleAddMeasurement = (type, value) => {
    const updatedProgress = addMeasurement(type, value);
    setProgress(updatedProgress);
  };

  const handleAddPhoto = (photoUrl) => {
    const updatedProgress = addProgressPhoto(photoUrl);
    setProgress(updatedProgress);
  };

  const handleUpdatePerformance = (category, metric, value) => {
    const updatedProgress = updatePerformanceMetric(category, metric, value);
    setProgress(updatedProgress);
  };

  const startEditing = (type, data = {}) => {
    setEditType(type);
    setEditData(data);
    setFormData(data);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'date' ? value : parseFloat(value) || value
    });
  };

  const saveEdit = () => {
    if (!editType) return;

    switch (editType) {
      case 'workout':
        handleWorkoutComplete(formData);
        break;
      case 'personal_record':
        handleUpdatePR(formData.exercise, {
          weight: formData.weight,
          reps: formData.reps,
          distance: formData.distance,
          time: formData.time
        });
        break;
      case 'measurement':
        handleAddMeasurement(formData.type, formData.value);
        break;
      case 'photo':
        handleAddPhoto(formData.url);
        break;
      case 'performance':
        handleUpdatePerformance(formData.category, formData.metric, formData.value);
        break;
      default:
        break;
    }

    setIsEditing(false);
    setEditType(null);
    setEditData(null);
    setFormData({});
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditType(null);
    setEditData(null);
    setFormData({});
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress data? This action cannot be undone.')) {
      const defaultData = resetProgress();
      setProgress(defaultData);
    }
  };

  const renderForm = () => {
    switch (editType) {
      case 'workout':
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type || 'strength'} onChange={handleInputChange}>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="hiit">HIIT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'personal_record':
        return (
          <>
            <div className="form-group">
              <label>Exercise</label>
              <select name="exercise" value={formData.exercise || ''} onChange={handleInputChange}>
                <option value="">Select Exercise</option>
                <option value="squats">Squats</option>
                <option value="deadlifts">Deadlifts</option>
                <option value="benchPress">Bench Press</option>
                <option value="pullUps">Pull Ups</option>
                <option value="pushUps">Push Ups</option>
                <option value="running">Running</option>
              </select>
            </div>
            {(formData.exercise === 'squats' || formData.exercise === 'deadlifts' || formData.exercise === 'benchPress') && (
              <div className="form-group">
                <label>Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {(formData.exercise === 'squats' || formData.exercise === 'deadlifts' || formData.exercise === 'benchPress' || 
              formData.exercise === 'pullUps' || formData.exercise === 'pushUps') && (
              <div className="form-group">
                <label>Reps</label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {formData.exercise === 'running' && (
              <>
                <div className="form-group">
                  <label>Distance (miles)</label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance || ''}
                    onChange={handleInputChange}
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Time (minutes)</label>
                  <input
                    type="number"
                    name="time"
                    value={formData.time || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </>
        );
      case 'measurement':
        return (
          <>
            <div className="form-group">
              <label>Measurement Type</label>
              <select name="type" value={formData.type || ''} onChange={handleInputChange}>
                <option value="">Select Type</option>
                <option value="weight">Weight</option>
                <option value="bodyFat">Body Fat %</option>
                <option value="chest">Chest</option>
                <option value="waist">Waist</option>
                <option value="hips">Hips</option>
                <option value="arms">Arms</option>
                <option value="legs">Legs</option>
              </select>
            </div>
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                name="value"
                value={formData.value || ''}
                onChange={handleInputChange}
                step="0.1"
              />
            </div>
          </>
        );
      case 'photo':
        return (
          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="text"
              name="url"
              value={formData.url || ''}
              onChange={handleInputChange}
            />
          </div>
        );
      case 'performance':
        return (
          <>
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category || ''} 
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>
            {formData.category && (
              <div className="form-group">
                <label>Metric</label>
                <select 
                  name="metric" 
                  value={formData.metric || ''} 
                  onChange={handleInputChange}
                >
                  {formData.category === 'endurance' && (
                    <>
                      <option value="">Select Metric</option>
                      <option value="running.distance">Running Distance</option>
                      <option value="running.time">Running Time</option>
                      <option value="cycling.distance">Cycling Distance</option>
                      <option value="cycling.time">Cycling Time</option>
                    </>
                  )}
                  {formData.category === 'strength' && (
                    <>
                      <option value="">Select Metric</option>
                      <option value="maxWeight">Max Weight</option>
                      <option value="totalVolume">Total Volume</option>
                    </>
                  )}
                  {formData.category === 'flexibility' && (
                    <>
                      <option value="">Select Metric</option>
                      <option value="sitAndReach">Sit and Reach</option>
                      <option value="shoulderMobility">Shoulder Mobility</option>
                    </>
                  )}
                  {formData.category === 'recovery' && (
                    <>
                      <option value="">Select Metric</option>
                      <option value="restingHeartRate">Resting Heart Rate</option>
                      <option value="sleepQuality">Sleep Quality</option>
                    </>
                  )}
                </select>
              </div>
            )}
            {formData.metric && (
              <div className="form-group">
                <label>Value</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value || ''}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const renderStatistics = () => {
    const { statistics } = progress;
    return (
      <div className="statistics-container">
        <h2>Workout Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Workouts</h3>
            <div className="stat-value">{statistics.totalWorkouts}</div>
          </div>
          <div className="stat-card">
            <h3>Current Streak</h3>
            <div className="stat-value">{statistics.currentStreak} days</div>
          </div>
          <div className="stat-card">
            <h3>Longest Streak</h3>
            <div className="stat-value">{statistics.longestStreak} days</div>
          </div>
          <div className="stat-card">
            <h3>This Week</h3>
            <div className="stat-value">{statistics.weeklyWorkouts} workouts</div>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <div className="stat-value">{statistics.monthlyWorkouts} workouts</div>
          </div>
          <div className="stat-card">
            <h3>Total Duration</h3>
            <div className="stat-value">{statistics.totalDuration} minutes</div>
          </div>
        </div>

        <h3 className="section-title">Workout Types</h3>
        <div className="workout-types-grid">
          <div className="type-card">
            <h4>Strength</h4>
            <div className="type-value">{statistics.workoutTypes.strength}</div>
          </div>
          <div className="type-card">
            <h4>Cardio</h4>
            <div className="type-value">{statistics.workoutTypes.cardio}</div>
          </div>
          <div className="type-card">
            <h4>Flexibility</h4>
            <div className="type-value">{statistics.workoutTypes.flexibility}</div>
          </div>
          <div className="type-card">
            <h4>HIIT</h4>
            <div className="type-value">{statistics.workoutTypes.hiit}</div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => startEditing('workout')}>Log Workout</button>
        </div>
      </div>
    );
  };

  const renderPersonalRecords = () => {
    const { personalRecords } = progress;
    return (
      <div className="personal-records-container">
        <h2>Personal Records</h2>
        <div className="pr-grid">
          {Object.entries(personalRecords.exercises).map(([exercise, data]) => {
            const exerciseName = exercise === 'benchPress' ? 'Bench Press' : 
              exercise.charAt(0).toUpperCase() + exercise.slice(1);
            
            return (
              <div className="pr-card" key={exercise}>
                <h3>{exerciseName}</h3>
                <div className="pr-details">
                  {data.weight > 0 && (
                    <div className="pr-item">
                      <span className="pr-label">Max Weight:</span>
                      <span className="pr-value">{data.weight} lbs</span>
                    </div>
                  )}
                  {data.reps > 0 && (
                    <div className="pr-item">
                      <span className="pr-label">Max Reps:</span>
                      <span className="pr-value">{data.reps}</span>
                    </div>
                  )}
                  {data.distance > 0 && (
                    <div className="pr-item">
                      <span className="pr-label">Max Distance:</span>
                      <span className="pr-value">{data.distance} miles</span>
                    </div>
                  )}
                  {data.time > 0 && (
                    <div className="pr-item">
                      <span className="pr-label">Best Time:</span>
                      <span className="pr-value">{data.time} min</span>
                    </div>
                  )}
                  {data.date && (
                    <div className="pr-date">
                      Achieved on {new Date(data.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="action-buttons">
          <button onClick={() => startEditing('personal_record')}>Add Personal Record</button>
        </div>
      </div>
    );
  };

  const renderMeasurements = () => {
    const { measurements } = progress;
    return (
      <div className="measurements-container">
        <h2>Body Measurements</h2>
        
        <div className="measurements-grid">
          {Object.entries(measurements).filter(([key]) => key !== 'photos').map(([type, data]) => {
            if (data.length === 0) return null;
            
            const typeName = type === 'bodyFat' ? 'Body Fat %' : 
              type.charAt(0).toUpperCase() + type.slice(1);
            
            const latestValue = data[data.length - 1];
            
            return (
              <div className="measurement-card" key={type}>
                <h3>{typeName}</h3>
                {latestValue && (
                  <div className="measurement-value">
                    <span className="current-value">{latestValue.value}</span>
                    <span className="measurement-unit">
                      {type === 'weight' ? 'lbs' : 
                       type === 'bodyFat' ? '%' : 'in'}
                    </span>
                    <div className="measurement-date">
                      Last updated: {new Date(latestValue.date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <h3 className="section-title">Progress Photos</h3>
        <div className="photos-grid">
          {measurements.photos.length > 0 ? (
            measurements.photos.map((photo, index) => (
              <div className="photo-card" key={index}>
                <img src={photo.url} alt={`Progress photo from ${new Date(photo.date).toLocaleDateString()}`} />
                <div className="photo-date">
                  {new Date(photo.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No progress photos yet.</p>
          )}
        </div>
        
        <div className="action-buttons">
          <button onClick={() => startEditing('measurement')}>Add Measurement</button>
          <button onClick={() => startEditing('photo')}>Add Photo</button>
        </div>
      </div>
    );
  };

  const renderPerformance = () => {
    const { performance } = progress;
    return (
      <div className="performance-container">
        <h2>Performance Metrics</h2>
        
        <div className="performance-section">
          <h3>Endurance</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <h4>Running</h4>
              <div className="performance-item">
                <span className="performance-label">Distance:</span>
                <span className="performance-value">{performance.endurance.running.distance} miles</span>
              </div>
              <div className="performance-item">
                <span className="performance-label">Time:</span>
                <span className="performance-value">{performance.endurance.running.time} mins</span>
              </div>
            </div>
            
            <div className="performance-card">
              <h4>Cycling</h4>
              <div className="performance-item">
                <span className="performance-label">Distance:</span>
                <span className="performance-value">{performance.endurance.cycling.distance} miles</span>
              </div>
              <div className="performance-item">
                <span className="performance-label">Time:</span>
                <span className="performance-value">{performance.endurance.cycling.time} mins</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-section">
          <h3>Strength</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-item">
                <span className="performance-label">Max Weight:</span>
                <span className="performance-value">{performance.strength.maxWeight} lbs</span>
              </div>
              <div className="performance-item">
                <span className="performance-label">Total Volume:</span>
                <span className="performance-value">{performance.strength.totalVolume} lbs</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-section">
          <h3>Flexibility</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-item">
                <span className="performance-label">Sit and Reach:</span>
                <span className="performance-value">{performance.flexibility.sitAndReach} inches</span>
              </div>
              <div className="performance-item">
                <span className="performance-label">Shoulder Mobility:</span>
                <span className="performance-value">{performance.flexibility.shoulderMobility} inches</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-section">
          <h3>Recovery</h3>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-item">
                <span className="performance-label">Resting Heart Rate:</span>
                <span className="performance-value">{performance.recovery.restingHeartRate} bpm</span>
              </div>
              <div className="performance-item">
                <span className="performance-label">Sleep Quality:</span>
                <span className="performance-value">{performance.recovery.sleepQuality}/10</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button onClick={() => startEditing('performance')}>Update Performance</button>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const { achievements } = progress;
    return (
      <div className="achievements-container">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.badges.map((badge) => (
            <div 
              className={`achievement-card ${badge.earned ? 'earned' : 'locked'}`} 
              key={badge.id}
            >
              <div className="achievement-icon">{badge.icon}</div>
              <div className="achievement-details">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                {badge.earned && (
                  <div className="earned-date">
                    Earned on {new Date(badge.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkoutHistory = () => {
    const { workoutHistory } = progress;
    return (
      <div className="workout-history-container">
        <h2>Workout History</h2>
        {workoutHistory.length > 0 ? (
          <div className="history-list">
            {workoutHistory.map((workout, index) => (
              <div className="history-item" key={index}>
                <div className="history-date">
                  {new Date(workout.date).toLocaleDateString()}
                </div>
                <div className="history-details">
                  <h3>{workout.title}</h3>
                  <div className="history-meta">
                    <span className="history-type">{workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>
                    <span className="history-duration">{workout.duration} minutes</span>
                    <span className="history-difficulty">{workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}</span>
                  </div>
                  {workout.notes && (
                    <div className="history-notes">
                      <p>{workout.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No workout history available yet.</p>
        )}
      </div>
    );
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Progress Tracking</h2>
        <div className="progress-actions">
          <button className="test-data-button" onClick={handleAddTestData}>
            Add Test Data
          </button>
          <button className="reset-progress-button" onClick={handleResetProgress}>
            Reset Progress
          </button>
        </div>
      </div>
      <div className="progress-tabs">
        <button
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
        <button
          className={`tab ${activeTab === 'personal-records' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal-records')}
        >
          Personal Records
        </button>
        <button
          className={`tab ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </button>
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Workout History
        </button>
      </div>

      <div className="progress-content">
        {activeTab === 'statistics' && renderStatistics()}
        {activeTab === 'personal-records' && renderPersonalRecords()}
        {activeTab === 'measurements' && renderMeasurements()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'history' && renderWorkoutHistory()}
      </div>

      {isEditing && (
        <div className="edit-modal">
          <div className="edit-content">
            <h3>
              {editType === 'workout' ? 'Log Workout' :
               editType === 'personal_record' ? 'Add Personal Record' :
               editType === 'measurement' ? 'Add Measurement' :
               editType === 'photo' ? 'Add Progress Photo' :
               editType === 'performance' ? 'Update Performance' : 'Edit Data'}
            </h3>
            <div className="edit-form">
              {renderForm()}
            </div>
            <div className="edit-actions">
              <button className="save-button" onClick={saveEdit}>Save</button>
              <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress; 