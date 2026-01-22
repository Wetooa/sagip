import json
import numpy as np
from pathlib import Path
from app.rag.similarity import cosine_similarity

class VectorStore:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.vectors = self._load()

    def _load(self):
        if self.file_path.exists():
            with open(self.file_path, "r") as f:
                return json.load(f)
        return []

    def save(self):
        # Create parent directory if it doesn't exist
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.file_path, "w") as f:
            json.dump(self.vectors, f, indent=2)

    def add(self, text: str, embedding: list[float], metadata: dict):
        self.vectors.append({
            "text": text,
            "embedding": embedding,
            "metadata": metadata
        })
        self.save()

    def search(self, query_embedding: list[float], top_k: int = 3):
        scored = []
        for item in self.vectors:
            score = cosine_similarity(
                np.array(query_embedding),
                np.array(item["embedding"])
            )
            scored.append((score, item))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored[:top_k]]