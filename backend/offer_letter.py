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
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ---- JWT Setup ----
SECRET_KEY = "19441678e34d5ff1feef4cd612f5a90858e69e24f1853a5d3cb467d4e422b6a9"
ALGORITHM = "HS256"
# make token optional for dev (auto_error=False)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

# Use environment variables (loaded from .env or system)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://wcwudnrtrccudoaigneo.supabase.co")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_KEY", "")

if not SUPABASE_KEY:
    print("WARNING: VITE_SUPABASE_KEY not set, PDF generation may fail.")

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
            end_date = start_date + timedelta(days=30)
            decision_date = start_date + timedelta(days=3)
            payload["decision_date"] = decision_date.strftime("%Y-%m-%d")
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

# Generate Entry PDF with all project details
@router.post("/generate-entry-pdf")
async def generate_entry_pdf(request: Request, preview: bool = Query(False), user=Depends(get_current_user)):
    """
    Generate a comprehensive project entry PDF with all details.
    Accepts form data from NewEntryPage; returns PDF (inline for preview).
    """
    try:
        body = await request.json()
        print(f"Received entry PDF request body: {body}")
    except Exception as e:
        print(f"JSON parse error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    # Create PDF with comprehensive project details
    pdf = CustomPDF()
    pdf.add_page()
    
    # Register font
    if os.path.exists(FONT_PATH):
        try:
            pdf.add_font("DejaVu", "", FONT_PATH, uni=True)
            pdf.set_font("DejaVu", "", 8.5)
        except Exception:
            pdf.set_font("Arial", "", 8.5)
    else:
        pdf.set_font("Arial", "", 8.5)

    # Position below letterhead
    pdf.set_xy(12, 48)
    
    # Extract all data
    client_name = body.get('clientName', 'N/A')
    event_name = body.get('eventName', 'N/A')
    client_contact = body.get('clientContact', 'N/A')
    client_email = body.get('clientEmail', 'N/A')
    event_start = body.get('eventStartDate', 'N/A')
    event_end = body.get('eventEndDate', 'N/A')
    event_type = body.get('eventType', 'N/A')
    event_code = body.get('eventCode', 'N/A')
    invoice_date = body.get('invoiceDate', 'N/A')
    amount = body.get('amount', '0')
    discount = body.get('discount', '0')
    poc = body.get('empPointOfContact', 'N/A')
    referral = body.get('referral', 'Direct Client')
    additional_notes = body.get('additionalNotes', 'None')
    deliverables = body.get('deliverables', [])
    
    # Calculate completion date
    completion_date = event_end
    try:
        end_date = datetime.strptime(event_end, '%Y-%m-%d')
        completion_date = (end_date + timedelta(days=30)).strftime('%Y-%m-%d')
    except:
        pass
    
    # Calculate financial details
    try:
        amount_val = float(amount) if amount else 0
        discount_val = float(discount) if discount else 0
        discount_amount = (amount_val * discount_val) / 100
        subtotal = amount_val - discount_amount
        tax_amount = subtotal * 0.18
        total_amount = subtotal + tax_amount
    except:
        subtotal = amount
        tax_amount = 0
        total_amount = amount
    
    # HEADER
    pdf.set_font("Arial", "B", 10)
    pdf.cell(0, 5, "MAK STARK CREATIVE AGENCY", ln=True, align="C")
    pdf.set_font("Arial", "B", 9)
    pdf.cell(0, 4, "PROJECT DETAILS & INVOICE", ln=True, align="C")
    pdf.set_font("Arial", "", 8)
    pdf.ln(2)
    
    # Event Code & Invoice Number & Date
    pdf.set_font("Arial", "B", 8)
    pdf.cell(60, 4, f"Event Code: {event_code}")
    pdf.cell(0, 4, f"Invoice Date: {invoice_date}", ln=True)
    pdf.set_font("Arial", "", 8)
    pdf.ln(1)
    
    # CLIENT INFORMATION
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "CLIENT INFORMATION:", ln=True)
    pdf.set_font("Arial", "", 7.5)
    pdf.cell(0, 3.5, f"Name: {client_name}", ln=True)
    pdf.cell(0, 3.5, f"Contact: {client_contact}", ln=True)
    pdf.cell(0, 3.5, f"Email: {client_email}", ln=True)
    pdf.cell(0, 3.5, f"Event: {event_name}", ln=True)
    pdf.ln(1)
    
    # EVENT DETAILS
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "EVENT DETAILS:", ln=True)
    pdf.set_font("Arial", "", 7.5)
    pdf.cell(0, 3.5, f"Start Date: {event_start}", ln=True)
    pdf.cell(0, 3.5, f"End Date: {event_end}", ln=True)
    pdf.cell(0, 3.5, f"Type: {event_type}", ln=True)
    pdf.ln(1)
    
    # FINANCIAL DETAILS
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "FINANCIAL DETAILS:", ln=True)
    pdf.set_font("Arial", "", 7.5)
    pdf.cell(0, 3.5, f"Base Amount: Rs. {amount}", ln=True)
    pdf.cell(0, 3.5, f"Discount: {discount}%", ln=True)
    pdf.cell(0, 3.5, f"Total Amount (incl. 18% GST): Rs. {total_amount:.2f}", ln=True)
    pdf.ln(1)
    
    # DELIVERABLES TABLE
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "DELIVERABLES:", ln=True)
    pdf.set_font("Arial", "", 7)
    
    # Table header
    col_width = 125
    status_width = 40
    pdf.set_fill_color(220, 220, 220)
    pdf.set_x(12)
    pdf.cell(col_width, 4, "Deliverable", border=1, fill=True)
    pdf.cell(status_width, 4, "Status", border=1, align="C", fill=True, ln=True)
    
    # Table rows
    for deliverable in deliverables:
        pdf.set_x(12)
        if len(deliverable) > 35:
            # Multi-line cell for long deliverables
            remaining = deliverable
            first_line = True
            while remaining:
                line = remaining[:35]
                remaining = remaining[35:]
                if first_line:
                    pdf.cell(col_width, 4, line, border=1)
                    pdf.cell(status_width, 4, "Included", border=1, align="C", ln=True)
                    first_line = False
                else:
                    pdf.set_x(12)
                    pdf.cell(col_width, 4, line, border=1)
                    pdf.cell(status_width, 4, "", border=1, ln=True)
        else:
            pdf.cell(col_width, 4, deliverable, border=1)
            pdf.cell(status_width, 4, "Included", border=1, align="C", ln=True)
    
    pdf.ln(1)
    
    # PROJECT TIMELINE
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "PROJECT TIMELINE:", ln=True)
    pdf.set_font("Arial", "", 7.5)
    timeline_text = f"Event Duration: {event_start} to {event_end}\nPre-production: 7-14 days before event\nPost-production: 30 days after event completion\nDelivery: {completion_date}"
    pdf.multi_cell(0, 3.5, timeline_text)
    pdf.ln(1)
    
    # ESTIMATED COMPLETION
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, f"ESTIMATED COMPLETION: {completion_date}", ln=True)
    pdf.ln(1)
    
    # POINT OF CONTACT
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "POINT OF CONTACT:", ln=True)
    pdf.set_font("Arial", "", 7.5)
    pdf.multi_cell(0, 3.5, poc)
    pdf.ln(1)
    
    # REFERRAL
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, f"REFERRAL: {referral}", ln=True)
    pdf.ln(1)
    
    # TERMS & CONDITIONS
    pdf.set_font("Arial", "B", 8)
    pdf.cell(0, 4, "TERMS & CONDITIONS:", ln=True)
    pdf.set_font("Arial", "", 7)
    terms = "1. Payment Terms: 50% advance, 50% on delivery\n2. Cancellation Policy: 30 days notice required\n3. Delivery: All deliverables within agreed timeline\n4. Revisions: Up to 2 rounds included\n5. Copyright: All materials property of Mak Stark\n6. Confidentiality: Project details remain confidential"
    pdf.multi_cell(0, 3, terms)
    pdf.ln(1)
    
    # ADDITIONAL NOTES
    if additional_notes and additional_notes != 'None':
        pdf.set_font("Arial", "B", 8)
        pdf.cell(0, 4, "ADDITIONAL NOTES:", ln=True)
        pdf.set_font("Arial", "", 7.5)
        pdf.multi_cell(0, 3.5, additional_notes)
    
    # Footer
    pdf.ln(1)
    pdf.set_font("Arial", "", 6)
    pdf.cell(0, 3, "Generated by Mak Stark Dashboard System", ln=True, align="C")
    
    # Generate PDF bytes
    try:
        raw = pdf.output(dest='S')
        if isinstance(raw, str):
            raw = raw.encode('latin-1')
    except Exception as e:
        print(f"PDF output error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
    
    if not raw or len(raw) == 0:
        raise HTTPException(status_code=500, detail="PDF generation resulted in empty output")
    
    filename = f"ProjectDetails_{client_name.replace(' ','_')}_{event_code}.pdf"
    disposition_type = "inline" if preview else "attachment"
    
    print(f"Generating entry PDF: {filename}, size: {len(raw)} bytes, preview: {preview}")
    
    response = StreamingResponse(
        BytesIO(raw), 
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'{disposition_type}; filename="{filename}"',
            "Content-Length": str(len(raw)),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }
    )
    return response

# Process Entry - handles form submission and returns processed data
@router.post("/process-entry")
async def process_entry(request: Request, user=Depends(get_current_user)):
    """
    Process a new entry from the NewEntryPage form.
    Returns processed data with generated invoice number, calculations, etc.
    """
    try:
        body = await request.json()
        print(f"Processing entry: {body.get('clientName', 'Unknown')}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    # Extract form data
    client_name = body.get('clientName', '')
    event_name = body.get('eventName', '')
    amount = body.get('amount', '0')
    discount = body.get('discount', '0')
    deliverables = body.get('deliverables', [])
    
    if not client_name or not event_name:
        raise HTTPException(status_code=400, detail="Client name and event name are required")

    try:
        # Convert to float for calculations
        amount_val = float(amount) if amount else 0
        discount_val = float(discount) if discount else 0
        
        # Calculate amounts
        discount_amount = (amount_val * discount_val) / 100
        subtotal = amount_val - discount_amount
        tax_rate = 0.18  # 18% GST
        tax_amount = subtotal * tax_rate
        final_amount = subtotal + tax_amount
        
        # Generate invoice number
        import uuid
        from datetime import datetime
        invoice_num = f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Calculate completion date (30 days from event end)
        event_end = body.get('eventEndDate', '')
        completion_date = event_end
        if event_end:
            try:
                from datetime import datetime, timedelta
                end_date = datetime.strptime(event_end, '%Y-%m-%d')
                completion_date = (end_date + timedelta(days=30)).strftime('%Y-%m-%d')
            except Exception as e:
                print(f"Date calculation error: {e}")
        
        # Generate project timeline
        timeline = f"""
Event Duration: {body.get('eventStartDate', '')} to {body.get('eventEndDate', '')}
Pre-production: 7-14 days before event
Post-production: 30 days after event completion
Delivery: {completion_date}
        """.strip()
        
        # Generate terms and conditions
        terms = """
1. Payment Terms: 50% advance, 50% on delivery
2. Cancellation Policy: 30 days notice for full refund
3. Delivery: All deliverables within agreed timeline
4. Revisions: Up to 2 rounds of revisions included
5. Copyright: All materials property of Mak Stark unless specified
6. Confidentiality: All project details are confidential
        """.strip()
        
        # Build response
        response_data = {
            "id": str(uuid.uuid4()),
            "formData": body,
            "generatedInvoiceNumber": invoice_num,
            "totalAmount": str(subtotal),
            "taxAmount": str(tax_amount),
            "finalAmount": str(final_amount),
            "termsAndConditions": terms,
            "projectTimeline": timeline,
            "estimatedCompletion": completion_date,
            "status": "processed"
        }
        
        print(f"Entry processed successfully: {invoice_num}")
        return response_data
        
    except Exception as e:
        print(f"Error processing entry: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing entry: {str(e)}")

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