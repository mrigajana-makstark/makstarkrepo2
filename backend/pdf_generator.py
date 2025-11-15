from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os
# from auth import router as auth_router
# from offer_letter import router as offer_router
# from pdf_generator import router as pdf_router

# ---- JWT Setup ----
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"                     # <-- Put your JWT secret key here
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/generate-pdf")
def generate_pdf(user=Depends(get_current_user)):
    # For demo, return a dummy PDF file
    dummy_pdf_path = os.path.join(os.path.dirname(__file__), "dummy.pdf")
    # Create a dummy PDF if not exists
    if not os.path.exists(dummy_pdf_path):
        with open(dummy_pdf_path, "wb") as f:
            f.write(b"%PDF-1.4\n%Dummy PDF\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF")
    return FileResponse(dummy_pdf_path, media_type="application/pdf", filename="generated.pdf")