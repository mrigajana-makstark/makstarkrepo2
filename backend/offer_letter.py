from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import StreamingResponse
from fpdf import FPDF
from io import BytesIO
import os
from supabase import create_client
from typing import Optional
from datetime import datetime, timedelta

# ---- JWT Setup ----
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"
ALGORITHM = "HS256"
# make token optional for dev (auto_error=False)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

SUPABASE_URL = "https://wcwudnrtrccudoaigneo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd3VkbnJ0cmNjdWRvYWlnbmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU5OTA4OCwiZXhwIjoyMDczMTc1MDg4fQ.oef-sMzX_0b15OOWECcUOGB3mDdlrG7L9_wYX9GhrLg"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter()

@router.post("/offer-letter")
async def offer_letter(request: Request):
    try:
        body = await request.json()
        print("Received JSON body:", body)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request body: {e}")

    

# Dependency to verify JWT (optional token)
def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    if not token:
        return None  # Allow requests without token in dev mode
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # In dev mode, allow invalid tokens to proceed; in prod you might want to raise
        return None

# --- Paths for template, font and letterhead (adjust if needed) ---
BASE_DIR = os.path.dirname(__file__)
TEMPLATE_PATH = os.path.join(BASE_DIR, "..", "template.txt")
FONT_PATH = os.path.join(BASE_DIR, "..", "DejaVuSans.ttf")
LETTERHEAD_PATH = os.path.join(BASE_DIR, "..", "letterhead-1.png")

# load template if exists
_TEMPLATE = ""
if os.path.exists(TEMPLATE_PATH):
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        _TEMPLATE = f.read()

class CustomPDF(FPDF):
    def header(self):
        if os.path.exists(LETTERHEAD_PATH):
            try:
                self.image(LETTERHEAD_PATH, x=0, y=0, w=210)
            except Exception:
                pass

    def footer(self):
        self.set_y(-15)
        if os.path.exists(FONT_PATH):
            try:
                self.set_font("DejaVu", "", 10)
            except Exception:
                self.set_font("Arial", "", 10)
        else:
            self.set_font("Arial", "", 10)
        self.cell(0, 10, "Mak Stark | Confidential", 0, 0, "C")

def build_pdf_bytes(data: dict) -> bytes:
    pdf = CustomPDF()
    pdf.add_page()
    # register font if available
    if os.path.exists(FONT_PATH):
        try:
            pdf.add_font("Courier New", "", FONT_PATH, uni=True)
            pdf.set_font("Courier New", "", 10)
        except Exception:
            pdf.set_font("Arial", "", 10)
    else:
        pdf.set_font("Arial", "", 10)

    # position below letterhead (adjust Y value depending on letterhead height)
    pdf.set_xy(20, 50)

    # use provided template if available, otherwise build a simple one
    if _TEMPLATE:
        try:
            # Add default empty values for missing fields
            safe_data = {
                "start_date": "",
                "end_date": "",
                "additionalNotes": "",
                "name": "",
                "position": "",
                "salary": "",
                "department": "",
                **data
            }
            text = _TEMPLATE.format(**safe_data)
            # Replace rupee symbol with "Rs." for PDF compatibility
            text = text.replace("₹", "Rs.")
        except Exception as e:
            raise ValueError(f"Template formatting error: {e}")
    else:
        # fallback simple template
        text = (
            f"Offer Letter\n\n"
            f"Name: {data.get('name','')}\n"
            f"Position: {data.get('position','')}\n"
            f"Salary: {data.get('salary','')}\n\n"
            "We are pleased to offer you the position.\n"
        )

    pdf.multi_cell(170, 8, text)
    
    # Use output with 'S' parameter to return as bytes string
    raw = pdf.output(dest='S')
    
    # Debug: Log the type and length
    print(f"PDF output type: {type(raw)}, length: {len(raw) if raw else 0}")
    
    # Ensure it's bytes
    if isinstance(raw, str):
        raw = raw.encode('latin-1')  # Use latin-1 for PDF encoding
    
    if not raw or len(raw) == 0:
        raise ValueError("PDF generation resulted in empty output")
    
    print(f"PDF bytes ready: {len(raw)} bytes")
    return raw

# Accept dynamic payloads from frontend (no strict pydantic model)
@router.post("/generate-offer")
async def generate_offer(request: Request, user=Depends(get_current_user)):
    """
    Accepts arbitrary JSON from the frontend (DashboardPage).
    Returns processed metadata (this endpoint can perform validations/calculations).
    """
    try:
        body = await request.json()
        print("Received JSON body:", body)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    # basic example processing: if salary present try to compute number
    salary = body.get("salary")
    try:
        salary_num = float(salary) if salary is not None else None
    except Exception:
        salary_num = None

    # build response metadata for frontend (you can expand this)
    resp = {
        "data": body,  # echo back full payload for later PDF generation
        "calculated_salary": (salary_num * 1.1) if salary_num is not None else None,
        "message": f"Processed offer payload for {body.get('name') or body.get('candidateName') or 'unknown'}"
    }
    return resp

# Generate PDF from arbitrary JSON payload
@router.post("/generate-offer-pdf")
async def generate_offer_pdf(request: Request, preview: bool = Query(False), user=Depends(get_current_user)):
    """
    Generate a PDF using the template and incoming JSON payload.
    Accepts full payload from DashboardPage; returns PDF (inline for preview).
    """
    try:
        body = await request.json()
        print(f"Received PDF request body: {body}")
    except Exception as e:
        print(f"JSON parse error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    # normalize common keys (allow both name and candidateName etc.)
    payload = {
        "name": body.get("name") or body.get("candidateName") or "",
        "position": body.get("position") or body.get("eventName") or "",
        "salary": body.get("salary") or body.get("amount") or body.get("ctc") or "",
        "start_date": body.get("start_date") or body.get("startDate") or "",
        "department": body.get("department") or body.get("dept") or "",
        **body  # keep all other fields available for template.format
    }
    
    print(f"Normalized payload: {payload}")
    
    # Calculate end date (3 days after start_date)
    start_date_str = payload.get("start_date") or ""
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            end_date = start_date + timedelta(days=3)
            payload["end_date"] = end_date.strftime("%Y-%m-%d")
        except Exception as e:
            print(f"Date parsing error: {e}")
            payload["end_date"] = ""
    else:
        payload["end_date"] = ""

    try:
        print(f"Building PDF with payload: {payload}")
        pdf_bytes = build_pdf_bytes(payload)
        print(f"PDF built successfully: {len(pdf_bytes)} bytes")
    except ValueError as e:
        print(f"ValueError in PDF generation: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in PDF generation: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    filename = f"Offer_Letter_{(payload.get('name') or 'offer').replace(' ','_')}.pdf"
    disposition_type = "inline" if preview else "attachment"
    
    # Ensure pdf_bytes is bytes
    if not isinstance(pdf_bytes, bytes):
        pdf_bytes = pdf_bytes.encode('utf-8') if isinstance(pdf_bytes, str) else bytes(pdf_bytes)
    
    print(f"Generating PDF: {filename}, size: {len(pdf_bytes)} bytes, preview: {preview}")
    
    response = StreamingResponse(
        BytesIO(pdf_bytes), 
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'{disposition_type}; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }
    )
    return response

# Optional: batch endpoint to generate multiple PDFs and return a zip
@router.post("/generate-offer-batch-zip")
async def generate_offer_batch_zip(request: Request, user=Depends(get_current_user)):
    import zipfile
    try:
        body = await request.json()
        print("JSON" ,body)
        items = body.get("items", [])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    mem_zip = BytesIO()
    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for idx, item in enumerate(items):
            try:
                pdf_bytes = build_pdf_bytes(item)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Item {idx} error: {e}")
            name = f"{(item.get('name') or f'Offer_{idx+1}').replace(' ', '_')}.pdf"
            zf.writestr(name, pdf_bytes)
    mem_zip.seek(0)
    return StreamingResponse(mem_zip, media_type="application/zip", headers={
        "Content-Disposition": 'attachment; filename="offer_letters.zip"'
    })