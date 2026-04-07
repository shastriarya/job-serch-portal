from pydantic import BaseModel, Field
from typing import List


class JobRecommendationItem(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    skills: List[str] = Field(default_factory=list)
    category: str | None = None
    type: str | None = None
    experience_level: str | None = None


class RecommendationRequest(BaseModel):
    skills: List[str]
    jobs: List[JobRecommendationItem] = Field(default_factory=list)
    top_k: int = 5


class ResumeRequest(BaseModel):
    text: str


class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str
