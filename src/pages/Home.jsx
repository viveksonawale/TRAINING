import React from 'react'

const Home = () => {
  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <h1>Your Personal Home Workout Guide</h1>
          <p>Transform your life with personalized workout routines, expert guidance, and progress tracking tools designed for your fitness journey</p>
          <div className="hero-cta">
            <button>Get Started</button>
            <button>Learn More</button>
          </div>
        </div>
      </header>

      <main>
        <section className="progress-tracking">
          <h2>Track Your Progress</h2>
          <div className="progress-cards">
            <div className="progress-card">
              <h3>Weekly Workouts</h3>
              <div className="progress-circle">4/5</div>
            </div>
            <div className="progress-card">
              <h3>Calories Burned</h3>
              <div className="progress-circle">2,500</div>
            </div>
            <div className="progress-card">
              <h3>Workout Streak</h3>
              <div className="progress-circle">7 days</div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home 