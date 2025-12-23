"""
FastAPI server for the Perceptron web application.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator
from typing import List
from pathlib import Path
from perceptron import Perceptron

app = FastAPI(
    title="Perceptron API",
    description="API for simulating a physical perceptron machine",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global perceptron instance
perceptron = Perceptron()

# Mount static files (built frontend)
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")


class PerceptronInput(BaseModel):
    """Input data for perceptron calculation."""
    inputs: List[int] = Field(..., min_length=16, max_length=16)
    weights: List[float] = Field(default=None, min_length=16, max_length=16)
    bias: float = 0.0
    
    @field_validator('inputs')
    @classmethod
    def validate_inputs(cls, v):
        if not all(x in [-1, 1] for x in v):
            raise ValueError("All inputs must be either 1 or -1")
        return v


class PerceptronOutput(BaseModel):
    """Output from perceptron calculation."""
    output: float
    weights: List[float]
    bias: float
    inputs: List[int]


class WeightsUpdate(BaseModel):
    """Update weights for the perceptron."""
    weights: List[float] = Field(..., min_length=16, max_length=16)


class BiasUpdate(BaseModel):
    """Update bias for the perceptron."""
    bias: float


@app.get("/api")
async def api_info():
    """API information endpoint."""
    return {
        "message": "Perceptron API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/calculate": "Calculate perceptron output",
            "GET /api/state": "Get current perceptron state",
            "POST /api/weights": "Update weights",
            "POST /api/bias": "Update bias",
            "POST /api/reset": "Reset to default state"
        }
    }


@app.get("/")
async def serve_frontend():
    """Serve the frontend application."""
    index_file = Path(__file__).parent / "static" / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Frontend not built. Run: cd frontend && npm run build"}


@app.post("/api/calculate", response_model=PerceptronOutput)
async def calculate(data: PerceptronInput):
    """
    Calculate the output of the perceptron for given inputs.
    
    If weights are provided, they will be used for this calculation.
    Otherwise, the current stored weights are used.
    """
    try:
        # Update weights if provided
        if data.weights is not None:
            perceptron.set_weights(data.weights)
        
        # Update bias
        perceptron.set_bias(data.bias)
        
        # Calculate output
        output = perceptron.calculate_output(data.inputs)
        
        return PerceptronOutput(
            output=output,
            weights=perceptron.get_weights(),
            bias=perceptron.get_bias(),
            inputs=data.inputs
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/state", response_model=dict)
async def get_state():
    """Get the current state of the perceptron."""
    return {
        "weights": perceptron.get_weights(),
        "bias": perceptron.get_bias()
    }


@app.post("/api/weights")
async def update_weights(data: WeightsUpdate):
    """Update the perceptron weights."""
    try:
        perceptron.set_weights(data.weights)
        return {
            "message": "Weights updated successfully",
            "weights": perceptron.get_weights()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/bias")
async def update_bias(data: BiasUpdate):
    """Update the perceptron bias."""
    perceptron.set_bias(data.bias)
    return {
        "message": "Bias updated successfully",
        "bias": perceptron.get_bias()
    }


@app.post("/api/reset")
async def reset():
    """Reset the perceptron to default state (all zeros)."""
    global perceptron
    perceptron = Perceptron()
    return {
        "message": "Perceptron reset to default state",
        "weights": perceptron.get_weights(),
        "bias": perceptron.get_bias()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
