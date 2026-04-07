from fastapi import APIRouter
from app.schemas.request_schema import RecommendationRequest, JobMatchRequest

from app.services.recommender_service import calculate_similarity, rank_jobs
router = APIRouter()


@router.post("/recommend")
def recommend_jobs(data: RecommendationRequest):
    return {
        "recommendations": rank_jobs(data.skills, data.jobs, data.top_k),
        "source": "ai-service",
    }


@router.post("/")
def match_resume(data: JobMatchRequest):
    score = calculate_similarity(
        data.resume_text,
        data.job_description
    )

    return {
        "score": round(score, 2)
    }
