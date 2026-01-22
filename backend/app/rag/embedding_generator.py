import openai
from app.core.config import settings

class EmbeddingGenerator:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.model = "text-embedding-3-small"

    def embed(self, text: str) -> list[float]:
        response = openai.embeddings.create(
            model=self.model,
            input=text
        )
        return response.data[0].embedding