from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from passlib.context import CryptContext
from jose import jwt
from auth import router as auth_router
from offer_letter import router as offer_router
from pdf_generator import router as pdf_router
from calculateAmount import router as calc_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Mriganka7@2025
DATABASE_URL = "postgresql://postgres:Mriganka7%402025@db.wcwudnrtrccudoaigneo.supabase.co:5432/postgres"
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"                     # <-- Put your JWT secret key here
ALGORITHM = "HS256"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)

# Try to create tables, but don't fail if database is unreachable
try:
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created/verified successfully")
except Exception as e:
    print(f"⚠️  Warning: Could not create database tables - {str(e)}")
    print("⚠️  The server will continue running. Database operations will fail until connection is restored.")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://makstark.com", "https://www.makstark.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(offer_router, prefix="/offer")
app.include_router(pdf_router, prefix="/pdf")
app.include_router(calc_router)

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.username == form_data.username).first()
        if not user or not pwd_context.verify(form_data.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="opps! look like Incorrect username or password, or maybe you dont have an account yet, please contact to admin")
        # Create JWT token
        token = jwt.encode({"sub": user.username, "role": user.role}, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=503, detail="Database service unavailable. Please try again later.")

@app.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    # Handle demo tokens (they start with "demo_token_")
    if token and token.startswith("demo_token_"):
        return {"username": "admin", "role": "admin", "mode": "demo"}
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["sub"], "role": payload.get("role", "user")}
    except Exception as e:
        print(f"Token decode error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.get("/")
def read_root():
    return {"message": "Mak Stark API is running time"}