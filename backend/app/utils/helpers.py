"""Utility helper functions for API endpoints."""
from typing import Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Query
from sqlalchemy import and_, or_


def paginate_query(
    query: Query,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    max_limit: int = 100
) -> Tuple[Query, int]:
    """
    Apply pagination to a SQLAlchemy query.
    
    Args:
        query: SQLAlchemy query object
        limit: Maximum number of results to return
        offset: Number of results to skip
        max_limit: Maximum allowed limit (default 100)
    
    Returns:
        Tuple of (paginated_query, total_count)
    """
    total_count = query.count()
    
    if limit is not None:
        if limit < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be non-negative"
            )
        if limit > max_limit:
            limit = max_limit
        query = query.limit(limit)
    
    if offset is not None:
        if offset < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Offset must be non-negative"
            )
        query = query.offset(offset)
    
    return query, total_count


def not_found_error(resource: str, resource_id: str = None) -> HTTPException:
    """
    Create a 404 Not Found error.
    
    Args:
        resource: Name of the resource (e.g., "Citizen", "Incident")
        resource_id: Optional ID of the resource
    
    Returns:
        HTTPException with 404 status
    """
    message = f"{resource} not found"
    if resource_id:
        message += f" with id {resource_id}"
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=message
    )


def validation_error(message: str) -> HTTPException:
    """
    Create a 400 Bad Request validation error.
    
    Args:
        message: Error message
    
    Returns:
        HTTPException with 400 status
    """
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message
    )


def forbidden_error(message: str = "Forbidden") -> HTTPException:
    """
    Create a 403 Forbidden error.
    
    Args:
        message: Error message
    
    Returns:
        HTTPException with 403 status
    """
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message
    )
