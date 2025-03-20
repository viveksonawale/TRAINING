import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Workouts from './pages/Workouts'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="logo">FitLife</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/workouts">Workouts</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<div>Progress Page Coming Soon</div>} />
          <Route path="/profile" element={<div>Profile Page Coming Soon</div>} />
        </Routes>

        <footer>
          <p>© 2024 FitLife. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
