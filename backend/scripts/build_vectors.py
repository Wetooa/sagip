import sys
from pathlib import Path

# Add parent directory to path so we can import app
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.rag.embedding_generator import EmbeddingGenerator
from app.rag.vector_store import VectorStore
from app.rag.knowledge_base import KnowledgeBase

embedder = EmbeddingGenerator()

stores = {
    "products": VectorStore("app/data/knowledge_base/product_vectors.json"),
    "faqs": VectorStore("app/data/knowledge_base/faq_vectors.json"),
    "policies": VectorStore("app/data/knowledge_base/policy_vectors.json"),
}

# Clear existing vectors before rebuilding
for store in stores.values():
    store.vectors = []
    store.save()

print("🔄 Rebuilding knowledge base vectors...")

# Build product vectors
print(f"📦 Processing {len(KnowledgeBase.PRODUCTS)} products...")
for item in KnowledgeBase.PRODUCTS:
    emb = embedder.embed(item["desc"])
    stores["products"].add(item["desc"], emb, item)

# Build FAQ vectors
print(f"❓ Processing {len(KnowledgeBase.FAQS)} FAQs...")
for item in KnowledgeBase.FAQS:
    emb = embedder.embed(item["q"] + " " + item["a"])
    stores["faqs"].add(item["q"], emb, item)

# Build policy vectors
print(f"📜 Processing {len(KnowledgeBase.POLICIES)} policies...")
for item in KnowledgeBase.POLICIES:
    emb = embedder.embed(item["text"])
    stores["policies"].add(item["text"], emb, item)

print("✅ Knowledge base vectors rebuilt successfully!")