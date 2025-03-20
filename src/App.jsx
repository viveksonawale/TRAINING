import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Workouts from './pages/Workouts'
import Progress from './components/Progress'
import { useState, useEffect } from 'react'
// Remove external package imports
// import "@theme-toggles/react/css/InnerMoon.css"
// import { InnerMoon } from "@theme-toggles/react"

function App() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to body element
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="logo hover-underline">MuscleBlaze</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/workouts">Workouts</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {darkMode ? (
              <div className="inner-moon-toggle">
                <div className="moon">
                  <div className="moon-crater"></div>
                  <div className="moon-crater moon-crater2"></div>
                  <div className="moon-crater moon-crater3"></div>
                </div>
              </div>
            ) : (
              <div className="inner-moon-toggle">
                <div className="sun">
                  <div className="sun-ray"></div>
                </div>
              </div>
            )}
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/workouts" 
            element={
              <Workouts 
                onWorkoutSelect={setSelectedWorkout}
                selectedWorkout={selectedWorkout}
              />
            } 
          />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<div>Profile Page Coming Soon</div>} />
        </Routes>

        <footer>
          <p>© 2024 MuscleBlaze. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
