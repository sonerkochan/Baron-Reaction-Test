import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(11080)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [wasSmited, setWasSmited] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning && health > 0) {
      interval = setInterval(() => {
        setHealth(prev => {
          const drop = Math.floor(Math.random() * (500 - 50 + 1)) + 50
          return Math.max(prev - drop, 0)
        })
      }, 200) // 0.2 seconds
    }

    return () => clearInterval(interval)
  }, [isRunning, health])

  // Detect if health reaches 0 and no smite happened
  useEffect(() => {
    if (health === 0 && isRunning) {
      setIsRunning(false)
      if (!wasSmited) {
        setResult('❌ Baron died... You missed the Smite!')
      }
    }
  }, [health, isRunning, wasSmited])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'f' || e.key === 'F') && isRunning && health > 0) {
        setIsRunning(false)
        setWasSmited(true)

        if (health === 1200) {
          setResult('✅ Perfect Smite! 1200 HP')
        } else if (health >= 1100 && health <= 1199) {
          setResult(`🟢 Excellent Smite! ${health} HP`)
        } else if (health >= 1000 && health <= 1099) {
          setResult(`🟡 Good Smite! ${health} HP`)
        } else if (health < 1000) {
          setResult(`🔴 Bad Smite! Too late – ${health} HP`)
        } else {
          setResult(`❌ Fail! Too early – ${health} HP`)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, health])

  const startTest = () => {
    setHealth(11080)
    setResult(null)
    setIsRunning(true)
    setWasSmited(false)
  }

  return (
    <div className="app">
      <h1>LoL Baron Smite Reaction Test</h1>
      <div className="healthbar-container">
        <div
          className="healthbar"
          style={{
            width: `${(health / 11080) * 100}%`,
            background: health < 2000
              ? 'linear-gradient(to top, #ff3333, #ff6666)'
              : 'linear-gradient(to top, #2aff00, #5fff33)'
          }}
        />
        <div className="ticks">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="tick" />
          ))}
        </div>
      </div>
      <p>Baron HP: {health}</p>
      {result && <h2>{result}</h2>}
      <button onClick={startTest} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Start Test'}
      </button>
      <p>Press <strong>F</strong> to Smite!</p>
    </div>
  )
}

export default App
