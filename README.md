# Perceptron Web Application

A modern web application that simulates a physical perceptron machine with an interactive UI.

## Overview

This project provides an interactive simulation of a physical perceptron device:
- **16 Input Switches**: Arranged in a 4×4 grid, each can be UP (+1) or DOWN (-1)
- **16 Weight Knobs**: Adjustable multipliers for each input
- **1 Bias Knob**: Additional offset value
- **Visual Output Display**: Shows the computed meter reading

The perceptron calculates: `Output = Σ(Input_i × Weight_i) + Bias`

## Architecture

- **Backend**: FastAPI (Python) serving REST API endpoints
- **Frontend**: React + Vite with responsive UI
- **Docker**: Multi-stage build for production deployment

## Project Structure

```
Perceptron/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── perceptron.py        # Core perceptron logic
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styles
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Node dependencies
├── Dockerfile              # Production build
├── docker-compose.yml      # Container orchestration
└── README.md              # This file
```

## Quick Start

### Option 1: Docker (Recommended)

**Production Mode** (builds frontend and serves via backend):
```bash
docker-compose up --build
```

Then open http://localhost:8000 in your browser.

**Development Mode** (with hot-reload):
```bash
docker-compose --profile dev up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Option 2: Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
# or: uvicorn main:app --reload
```

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## API Endpoints

- `GET /` - API information
- `POST /calculate` - Calculate perceptron output
- `GET /state` - Get current weights and bias
- `POST /weights` - Update weights
- `POST /bias` - Update bias
- `POST /reset` - Reset to default state

### Example API Request

```bash
curl -X POST http://localhost:8000/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": [1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1],
    "weights": [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    "bias": 0.0
  }'
```

## Features

### Interactive UI
- **4×4 Switch Grid**: Click to toggle between UP (+1) and DOWN (-1)
- **Weight Controls**: Adjust each of the 16 weights individually
- **Bias Control**: Set the bias term
- **Real-time Calculation**: Instant feedback on output changes
- **Visual Feedback**: Color-coded switches (green for UP, red for DOWN)
- **Responsive Design**: Works on desktop and mobile

### Backend Features
- RESTful API with FastAPI
- Automatic API documentation at `/docs`
- CORS enabled for frontend integration
- Input validation with Pydantic models

## Development

### Building for Production

```bash
# Build Docker image
docker build -t perceptron:latest .

# Run container
docker run -p 8000:8000 perceptron:latest
```

### Testing the Backend

```bash
cd backend
python -m pytest tests/  # (add tests as needed)
```

### Customizing

- **Frontend styling**: Edit `frontend/src/App.css`
- **API endpoints**: Modify `backend/main.py`
- **Perceptron logic**: Update `backend/perceptron.py`

## Technology Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic
- **Frontend**: React 18, Vite 5, Modern CSS
- **Deployment**: Docker, Docker Compose

## Based On

This implementation is inspired by early AI systems that used physical circuits. The perceptron was one of the first machine learning algorithms, demonstrating how simple weighted sums can perform classification tasks.
