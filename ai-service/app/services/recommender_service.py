from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(text1: str, text2: str):
    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(vectors)[0][1]

    return float(similarity * 100)


def rank_jobs(skills, jobs, top_k=5):
    if not skills or not jobs:
        return []

    profile_text = " ".join(skills)
    job_texts = [
        " ".join(
            filter(
                None,
                [
                    job.title,
                    job.company,
                    job.location,
                    job.description,
                    " ".join(job.skills or []),
                    job.category,
                    job.type,
                    job.experience_level,
                ],
            )
        )
        for job in jobs
    ]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([profile_text, *job_texts])
    similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    ranked = []
    normalized_skills = {skill.lower() for skill in skills}

    for job, similarity in zip(jobs, similarities):
        matched_skills = [
            skill for skill in (job.skills or []) if skill.lower() in normalized_skills
        ]
        ranked.append(
            {
                "job_id": job.id,
                "score": round(float(similarity * 100), 2),
                "matched_skills": matched_skills,
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return ranked[: max(1, top_k)]
