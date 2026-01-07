from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import TaxRequest, ComparisonResponse
from tax_engine import compare_tax_regimes

app = FastAPI(title="Salary Optimizer API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", 
        "http://localhost:5176", "http://localhost:5177", "http://localhost:5178",
        "http://localhost:5179", "http://localhost:5180", "http://localhost:5181",
        "http://localhost:5182", "http://localhost:5183", "http://localhost:5184",
        "http://localhost:5185", "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Salary Optimizer API is running"}

@app.post("/api/calculate", response_model=ComparisonResponse)
def calculate_tax(request: TaxRequest):
    return compare_tax_regimes(request)

# Serve React App (SPA)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Check if the build directory exists (it will in Docker)
if os.path.exists("input_dist"):
    app.mount("/assets", StaticFiles(directory="input_dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Serve index.html for any non-API route to allow React Router to handle paths
        if full_path.startswith("api"):
            return {"error": "API route not found"}
        
        # Determine strict file path
        file_path = f"input_dist/{full_path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse("input_dist/index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
