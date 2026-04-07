from fastapi import APIRouter
from app.schemas.request_schema import ResumeRequest
from app.services.nlp import extract_skills

router = APIRouter()


@router.post("/parse")
def parse_resume(data: ResumeRequest):
    skills = extract_skills(data.text)

    return {
        "skills": skills
    }