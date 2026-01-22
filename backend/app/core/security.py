"""Authentication and authorization utilities."""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
import bcrypt

from app.core.config import settings
from app.core.database import get_db
from app.models.citizen import Citizen

# Password hashing context
# Initialize with workaround for bcrypt version detection issues
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Suppress bcrypt version detection errors by setting backend explicitly
try:
    import passlib.handlers.bcrypt as bcrypt_handler
    # Try to set backend to avoid detection issues
    if hasattr(bcrypt_handler, 'set_backend'):
        try:
            bcrypt_handler.set_backend('bcrypt', dryrun=True)
        except:
            pass
except:
    pass

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login", auto_error=False)
# Optional bearer token for endpoints that don't require authentication
optional_bearer = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    if pwd_context is None:
        # Fallback to direct bcrypt
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    # Ensure password is a string and within bcrypt's 72-byte limit
    if not isinstance(password, str):
        password = str(password)
    
    # Bcrypt has a 72-byte limit, truncate if necessary
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password = password_bytes[:72].decode('utf-8', errors='ignore')
        password_bytes = password.encode('utf-8')
    
    if pwd_context is None:
        # Fallback to direct bcrypt to avoid passlib backend detection issues
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    
    try:
        return pwd_context.hash(password)
    except (ValueError, AttributeError) as e:
        # If passlib fails, use direct bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Citizen:
    """
    Dependency to get the current authenticated user from JWT token.
    Returns the full Citizen object from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token is None:
        raise credentials_exception
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Fetch user from database
    user = db.query(Citizen).filter(Citizen.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer),
    db: Session = Depends(get_db)
) -> Optional[Citizen]:
    """
    Optional dependency to get the current authenticated user from JWT token.
    Returns None if no token is provided or token is invalid.
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    if user_id is None:
        return None
    
    # Fetch user from database
    user = db.query(Citizen).filter(Citizen.id == user_id).first()
    if user is None or not user.is_active:
        return None
    
    return user
