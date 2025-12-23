# Perceptron

A software implementation of a physical perceptron machine with 16 inputs, learnable weights, and a bias term.

## Overview

This project simulates a physical perceptron device that consists of:
- **16 Input Switches**: Each can be UP (1) or DOWN (-1)
- **16 Weight Knobs**: Multipliers for each input
- **1 Bias Knob**: Additional offset value
- **Meter**: Shows the output (sum of weighted inputs + bias)

The perceptron calculates: `Output = Σ(Input_i × Weight_i) + Bias`

## Files

- `perceptron.py` - Python implementation
- `perceptron.js` - Node.js implementation

## Running the Examples

### Python

Make sure you have Python 3 installed, then run:

```bash
python perceptron.py
```

### Node.js

Make sure you have Node.js installed, then run:

```bash
node perceptron.js
```

## Example Output

Both implementations will demonstrate the perceptron with sample weights and inputs, displaying the calculated meter reading.

## Usage

### Python

```python
from perceptron import Perceptron

# Create perceptron with custom weights
weights = [10.0] * 16  # All weights set to 10
p = Perceptron(weights=weights, bias=0.0)

# Set inputs (1 for UP, -1 for DOWN)
inputs = [1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1]

# Calculate output
output = p.calculate_output(inputs)
print(f"Meter Reading: {output}")
```

### JavaScript

```javascript
const Perceptron = require('./perceptron');

// Create perceptron with custom weights
const weights = new Array(16).fill(10);
const p = new Perceptron(weights, 0.0);

// Set inputs (1 for UP, -1 for DOWN)
const inputs = [1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1];

// Calculate output
const output = p.calculateOutput(inputs);
console.log(`Meter Reading: ${output}`);
```

## Based On

This implementation is inspired by early AI systems that used physical circuits. The perceptron adds together the values of all "switched on" dials and subtracts the values of the "switched off" dials.
