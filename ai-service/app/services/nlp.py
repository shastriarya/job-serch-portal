from app.utils.preprocess import clean_text

try:
    import spacy

    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None


def extract_skills(text: str):
    cleaned = clean_text(text)

    if nlp is None:
        return list(
            dict.fromkeys(
                [
                    token
                    for token in cleaned.split()
                    if token.isalpha() and len(token) > 2
                ]
            )
        )

    doc = nlp(cleaned)
    return list(dict.fromkeys([token.text for token in doc if token.is_alpha]))
