def format_rag_context(results: list, max_items: int = 4, max_chars: int = 600):
    """
    Compresses RAG results into a short, safe context block.
    """
    formatted = []

    for item in results[:max_items]:
        text = item.get("text", "")
        meta = item.get("metadata", {})

        # Trim long text
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        title = meta.get("name") or meta.get("title") or meta.get("q") or "Reference"

        formatted.append(f"• {title}: {text}")

    return "\n".join(formatted)