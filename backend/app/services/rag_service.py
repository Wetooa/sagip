from app.rag.embedding_generator import EmbeddingGenerator
from app.rag.vector_store import VectorStore

class RAGService:
    def __init__(self):
        self.embedder = EmbeddingGenerator()
        self.product_store = VectorStore("app/data/knowledge_base/product_vectors.json")
        self.faq_store = VectorStore("app/data/knowledge_base/faq_vectors.json")
        self.policy_store = VectorStore("app/data/knowledge_base/policy_vectors.json")

    def retrieve(self, query: str, top_k: int = 2):
        query_embedding = self.embedder.embed(query)

        results = []
        for store in [self.product_store, self.faq_store, self.policy_store]:
            results.extend(store.search(query_embedding, top_k))
        return results[:5]