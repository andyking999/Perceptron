import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

// Circular knob component
function Knob({ value, onChange, label, min = -10, max = 10 }) {
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef(null)
  const startAngleRef = useRef(0)
  const startValueRef = useRef(0)

  const valueToAngle = (val) => {
    const range = max - min
    const normalizedValue = (val - min) / range
    return normalizedValue * 270 - 135 // -135° to 135° range
  }

  const angleToValue = (angle) => {
    const normalizedAngle = (angle + 135) / 270 // Normalize to 0-1
    const range = max - min
    return Math.min(max, Math.max(min, normalizedAngle * range + min))
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    startValueRef.current = value
    const rect = knobRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    startAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !knobRef.current) return
      
      const rect = knobRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
      
      let deltaAngle = currentAngle - startAngleRef.current
      
      // Adjust for sensitivity - move by 1.0 increments
      const newValue = startValueRef.current + (deltaAngle / 270) * (max - min)
      const clampedValue = Math.min(max, Math.max(min, newValue))
      
      // Round to whole numbers (1.0 increments)
      onChange(Math.round(clampedValue))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onChange, min, max])

  const angle = valueToAngle(value)

  return (
    <div className="knob-container">
      <div className="knob-label">{label}</div>
      <div 
        ref={knobRef}
        className={`knob ${isDragging ? 'knob-dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="knob-dial" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="knob-indicator"></div>
        </div>
        <div className="knob-center"></div>
      </div>
      <div className="knob-value">{value.toFixed(0)}</div>
    </div>
  )
}

function App() {
  const [inputs, setInputs] = useState(Array(16).fill(-1))
  const [weights, setWeights] = useState(Array(16).fill(0))
  const [bias, setBias] = useState(0)
  const [output, setOutput] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  // Load initial state
  useEffect(() => {
    fetch(`${API_URL}/state`)
      .then(res => res.json())
      .then(data => {
        setWeights(data.weights)
        setBias(data.bias)
      })
      .catch(err => console.error('Failed to load state:', err))
  }, [])

  const toggleInput = (index) => {
    const newInputs = [...inputs]
    newInputs[index] = newInputs[index] === 1 ? -1 : 1
    setInputs(newInputs)
  }

  const updateWeight = (index, value) => {
    const newWeights = [...weights]
    newWeights[index] = value
    setWeights(newWeights)
  }

  const calculate = async () => {
    setIsCalculating(true)
    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, weights, bias })
      })
      const data = await response.json()
      setOutput(data.output)
    } catch (err) {
      console.error('Calculation failed:', err)
    } finally {
      setIsCalculating(false)
    }
  }

  const reset = async () => {
    try {
      await fetch(`${API_URL}/reset`, { method: 'POST' })
      setInputs(Array(16).fill(-1))
      setWeights(Array(16).fill(0))
      setBias(0)
      setOutput(0)
    } catch (err) {
      console.error('Reset failed:', err)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>⚡ Perceptron Simulator</h1>
        <p>Physical machine simulation with 16 inputs, weights, and bias</p>
      </header>

      <div className="container">
        <div className="panel switches-panel">
          <h2>Input Switches (4×4 Grid)</h2>
          <div className="switches-grid">
            {inputs.map((value, index) => (
              <button
                key={index}
                className={`switch ${value === 1 ? 'switch-up' : 'switch-down'}`}
                onClick={() => toggleInput(index)}
                title={`Switch ${index + 1}: ${value === 1 ? 'UP' : 'DOWN'}`}
              >
                <div className="switch-label">{index + 1}</div>
                <div className="switch-indicator">{value === 1 ? '▲' : '▼'}</div>
                <div className="switch-value">{value}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="panel weights-panel">
          <h2>Learnable Weights</h2>
          <p className="panel-description">Rotate knobs to adjust weight values</p>
          <div className="weights-grid">
            {weights.map((weight, index) => (
              <Knob
                key={index}
                label={`W${index + 1}`}
                value={weight}
                onChange={(newValue) => updateWeight(index, newValue)}
                min={-10}
                max={10}
              />
            ))}
          </div>
        </div>

        <div className="panel control-panel">
          <h2>Control Panel</h2>
          
          <div className="bias-section">
            <h3>Bias Knob</h3>
            <div className="bias-knob-wrapper">
              <Knob
                label="Bias"
                value={bias}
                onChange={setBias}
                min={-10}
                max={10}
              />
            </div>
          </div>

          <div className="output-display">
            <div className="meter-container">
              <div className="meter-label">ANALOG METER</div>
              <div className="meter-scale">
                <div className="meter-needle" style={{ 
                  transform: `rotate(${Math.min(90, Math.max(-90, output * 0.5))}deg)` 
                }}></div>
                <div className="meter-arc"></div>
              </div>
              <div className="meter-reading">
                <span className="meter-value">{output.toFixed(2)}</span>
                <span className="meter-unit">MICROVOLTS</span>
              </div>
            </div>
            <div className="output-formula">
              Σ(Input × Weight) + Bias
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={calculate} 
              disabled={isCalculating}
              className="btn btn-primary"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Output'}
            </button>
            <button 
              onClick={reset}
              className="btn btn-secondary"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Formula: Output = Σ(Input<sub>i</sub> × Weight<sub>i</sub>) + Bias</p>
        <p>Each input can be UP (+1) or DOWN (-1)</p>
      </footer>
    </div>
  )
}

export default App
