# Portfolio Card Upload - ImageKit Integration & Fix

## Changes Summary

### 1. **ImageKit Image Upload System**

#### New Backend Files:
- **`backend/imagekit_upload.py`** - ImageKit upload utility with two functions:
  - `upload_to_imagekit()` - Uploads raw file bytes to ImageKit
  - `upload_base64_to_imagekit()` - Uploads base64 encoded images to ImageKit

#### Backend Endpoints (in `main.py`):
- **`POST /upload-base64-image`** - Upload base64 images (primary method for the portfolio)
  - Takes: `{ image: "data:...", filename: "...", folder: "..." }`
  - Returns: `{ success: true, data: { url, fileId, fileName, filePath, width, height } }`

- **`POST /upload-image`** - Upload file uploads (alternative method)
  - Takes: Multipart file upload
  - Returns: Same ImageKit response

### 2. **Fixed Portfolio Synchronization Issues**

#### PortfolioCardUpload Changes:
- **Event Dispatching**: Added 100ms delay before dispatching `customCardAdded` event to ensure localStorage is fully updated
- **Event Detail**: Now sends event with detail object containing `{ action, card, cardId }` for better tracking
- **ImageKit Upload**: All images now upload to ImageKit instead of storing base64 locally

#### PortfolioPage Changes:
- **Event Listener**: Added 150ms timeout after receiving event to ensure localStorage is fully synchronized
- **Console Logging**: Added debug logs to track when cards are loaded
- **Comments**: Updated to reflect ImageKit URLs instead of base64

### 3. **API Configuration Updates**

Added new endpoints to `src/config/apiConfig.ts`:
```typescript
upload: {
  base64Image: `${API_BASE_URL}/upload-base64-image`,
  file: `${API_BASE_URL}/upload-image`,
}
```

### 4. **Environment Configuration**

Updated `backend/.env` with ImageKit settings:
```env
VITE_IMAGEKIT_PRIVATE_KEY=your_key
VITE_IMAGEKIT_PUBLIC_KEY=your_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/makstark
```

### 5. **Dependencies**

Added to `backend/requirements.txt`:
- `requests==2.31.0` - For making HTTP requests to ImageKit API
- `python-dotenv==1.0.0` - For environment variable management

---

## How to Use

### 1. Get ImageKit Credentials
- Go to https://imagekit.io/dashboard/developer/api-keys
- Copy your **Private Key**, **Public Key**, and **URL Endpoint**

### 2. Update Environment Variables
Edit `backend/.env`:
```env
VITE_IMAGEKIT_PRIVATE_KEY=your_actual_private_key
VITE_IMAGEKIT_PUBLIC_KEY=your_actual_public_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/makstark
```

### 3. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Restart Backend
```bash
python -m uvicorn main:app --reload
```

### 5. Test Upload
1. Go to Dashboard → Card Upload & Management
2. Upload a cover image (it will upload to ImageKit)
3. Fill in other details
4. Click "Publish Card"
5. **Wait a moment** - the card should now appear in the Portfolio page

---

## Flow Diagram

```
User uploads image
    ↓
FileReader converts to base64
    ↓
Frontend sends to /upload-base64-image
    ↓
Backend uploads to ImageKit API
    ↓
ImageKit returns CDN URL (e.g., https://ik.imagekit.io/makstark/...)
    ↓
Frontend displays URL (not base64)
    ↓
Card saved to localStorage with ImageKit URLs
    ↓
Event dispatched after 100ms (ensures localStorage updated)
    ↓
PortfolioPage listener triggers after 150ms
    ↓
PortfolioPage reloads from localStorage
    ↓
Card appears in portfolio grid
```

---

## Troubleshooting

### Card not showing in portfolio after upload?
1. Check browser DevTools Console for errors
2. Verify localStorage has the card:
   - Open DevTools → Application → localStorage
   - Find key `customPortfolioCards`
   - Check if new card is present
3. Hard refresh page (Ctrl+Shift+R)

### ImageKit upload failing?
1. Check backend terminal for error messages
2. Verify ImageKit credentials in `.env` are correct
3. Check that backend is running: http://localhost:8000/docs
4. Test endpoint manually: POST to `/upload-base64-image` with test image

### Images still showing as base64?
- Old cards in localStorage are base64
- Delete `customPortfolioCards` from browser localStorage
- Re-upload cards (new ones will use ImageKit URLs)

---

## File Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `backend/imagekit_upload.py` | NEW | ImageKit upload utility |
| `backend/main.py` | MODIFIED | Added upload endpoints |
| `backend/requirements.txt` | MODIFIED | Added requests + dotenv |
| `backend/.env` | MODIFIED | Added ImageKit credentials |
| `src/components/PortfolioCardUpload.tsx` | MODIFIED | ImageKit upload + event fix |
| `src/components/PortfolioPage.tsx` | MODIFIED | Better event listener + logging |
| `src/config/apiConfig.ts` | MODIFIED | Added upload endpoints |

---

## Next Steps (Optional)

1. **Image Optimization**: Add compression before upload
2. **Progress Feedback**: Show upload progress bar
3. **Drag & Drop**: Support dragging images into upload area
4. **Batch Upload**: Upload multiple images at once
5. **Backend Storage**: Store card metadata in database instead of localStorage
