from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ---- Supabase & JWT Setup ----
# Use environment variables (loaded from .env or system)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://wcwudnrtrccudoaigneo.supabase.co")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_KEY", "")
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"
ALGORITHM = "HS256"

if not SUPABASE_KEY:
    print("WARNING: VITE_SUPABASE_KEY not set, authentication may fail.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    # Query Supabase users table for the given email
    result = supabase.table("users").select("*").eq("email", request.email).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = result.data[0]
    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # Create JWT token
    token = create_access_token({"sub": user["email"], "role": user.get("role", "employee")})
    return {"access_token": token, "token_type": "bearer"}