from fastapi import APIRouter, HTTPException, Request
from supabase import create_client
from datetime import datetime
from dateutil import parser
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Use environment variables (loaded from .env or system)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://wcwudnrtrccudoaigneo.supabase.co")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_KEY", "")

if not SUPABASE_KEY:
    raise ValueError("VITE_SUPABASE_KEY environment variable not set. Please configure your .env file.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/calculate-amount")
async def calculate_amount(request: Request):
    try:
        body = await request.json()
        print("Received JSON body:", body)
        eventType = body.get("eventType", "")
        deliverables = body.get("deliverables", [])
        discount = body.get("discount", 0)
        startTime = body.get("startTime", "")
        endTime = body.get("endTime", "")

        if not deliverables:
            raise HTTPException(status_code=400, detail="No deliverables provided")

        try:
            # Fetch rates from Supabase
            responseForDaysEvent = supabase.table("FactorForAmountCalculationDay").select("deliverable, amount").in_("deliverable", deliverables).execute()
            response = supabase.table("FactorForAmountCalculation").select("deliverable, amount").in_("deliverable", deliverables).execute()
            print("Deliverables response:", eventType)
            client_name = body.get("clientName", "")

            eventNumber = supabase.table("FactorForEventCode").select("eventType, eventCode").eq("eventType", eventType).execute()

            print("Event number response:", eventNumber)
            print("Supabase response (per event):", response)
            print("Supabase response (per day):", responseForDaysEvent)
        except Exception as db_error:
            print(f"Database error: {db_error}")
            raise HTTPException(status_code=503, detail="Database service unavailable. Please try again later.")

        # Check if data is present
        if response.data is None and responseForDaysEvent.data is None:
            raise HTTPException(status_code=500, detail="Error fetching rates from Supabase.")
        # create the event code
        eventCode = "MSS"
        startTimeYear = "25"
        startTimeMonth = "01"
        if startTime:
            print(startTime)
            #try:
                #start_dt = parser.parse(startTime)  # handles many formats
                #print(start_dt)
                # last two digits of year, zero-padded
                #startTimeYear = f"{start_dt.year % 100:02d}"
                # month as two-digit string
                #startTimeMonth = f"{start_dt.month:02d}"
            #except Exception as e:
            #    raise HTTPException(status_code=400, detail=f"Date parsing error: {str(e)}")
        if (isinstance(startTimeMonth, int) and startTimeMonth < 10):
            startTimeMonth = "0" + str(startTimeMonth)
        else:
            startTimeMonth = str(startTimeMonth)
        event_code_suffix = ""
        if eventNumber.data and len(eventNumber.data) > 0:
            event_code_suffix = str(eventNumber.data[0].get('eventCode', ''))
        eventCode = "MSS" + str(startTimeYear) + str(startTimeMonth) + event_code_suffix
        print("Generated event code:", eventCode)
        # Calculate total amount
                # Calculate total amount
        totalPerDay = sum(float(item["amount"]) for item in (responseForDaysEvent.data or []))
        total = sum(float(item["amount"]) for item in (response.data or []))

        # Per day calculation
        if startTime and endTime and totalPerDay > 0:
            from datetime import datetime
            try:
                start_date = datetime.strptime(startTime, "%Y-%m-%d")
                end_date = datetime.strptime(endTime, "%Y-%m-%d")
                days_diff = (end_date - start_date).days + 1
                totalPerDay *= days_diff
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Date parsing error: {str(e)}")

        # Total
        total += totalPerDay

        # Apply discount if any (ensure discount is a valid float)
        try:
            discount_val = float(discount) if discount not in (None, '', 0) else 0
        except Exception:
            discount_val = 0

        if discount_val:
            total -= (total * (discount_val / 100))

        print("Final calculated amount:", total)

        return {"amount": total, "event_code": eventCode}
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions to be handled by FastAPI
        raise http_exc
    except Exception as e:
        # Catch all other exceptions and return as error message
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
