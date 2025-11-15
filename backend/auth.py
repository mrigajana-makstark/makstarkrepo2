from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from supabase import create_client, Client

# ---- Supabase & JWT Setup ----
SUPABASE_URL = "https://wcwudnrtrccudoaigneo.supabase.co"  # <-- Put your Supabase URL here
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3VkbnJ0cmNjdWRvYWlnbmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU5OTA4OCwiZXhwIjoyMDczMTc1MDg4fQ.oef-sMzX_0b15OOWECcUOGB3mDdlrG7L9_wYX9GhrLg"    # <-- Put your Supabase service role key here
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"                     # <-- Put your JWT secret key here
ALGORITHM = "HS256"

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