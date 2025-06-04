from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models # Assuming models.py is in the same directory
from . import services # Assuming services.py is in the same directory

app = FastAPI(
    title="MedGemma Educational App API",
    version="0.1.0",
    description="API for the MedGemma Educational App, providing access to medical terminology explanations and more."
)

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend on port 3000
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

@app.on_event("startup")
async def startup_event():
    print("Attempting to load MedGemma model on startup...")
    services.load_medgemma_model() # Load the model when the application starts
    if services.model is None or services.processor is None:
        print("MedGemma model could not be loaded on startup. The /api/explain-term endpoint might not function correctly.")
    else:
        print("MedGemma model loaded successfully on startup.")

@app.get("/", summary="Root endpoint", description="Provides a welcome message and API status.")
async def read_root():
    return {"message": "Welcome to the MedGemma Educational App API!"}

@app.post("/api/explain-term", response_model=models.ExplanationResponse, summary="Explain Medical Term")
async def explain_term_endpoint(request: models.TermRequest):
    explanation = await services.get_medgemma_explanation(request.term)
    return models.ExplanationResponse(explanation=explanation)

if __name__ == "__main__":
    import uvicorn
    # For development, run directly. For production, use a process manager like Gunicorn with Uvicorn workers.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) # Added reload=True for development
