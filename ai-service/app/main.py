from fastapi import FastAPI
from app.routes.recommendation import router as recommendation_router
from app.routes.resume_parser import router as resume_router

app = FastAPI()

app.include_router(recommendation_router, prefix="/ai")
app.include_router(resume_router, prefix="/ai")


@app.get("/")
def root():
    return {"message": "AI Service Running"}