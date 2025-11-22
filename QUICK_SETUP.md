# Quick Setup Guide - Portfolio Upload with ImageKit

## ⚡ Quick Start (5 minutes)

### Step 1: Get ImageKit API Keys
1. Visit https://imagekit.io/dashboard/developer/api-keys
2. Copy your credentials and paste into `backend/.env`:

```env
VITE_IMAGEKIT_PRIVATE_KEY=<your_private_key>
VITE_IMAGEKIT_PUBLIC_KEY=<your_public_key>
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/makstark
```

### Step 2: Restart Backend
```bash
cd backend
python -m uvicorn main:app --reload
```

### Step 3: Test in Frontend
1. Navigate to: Dashboard → Card Upload & Management
2. Upload a portfolio card
3. Check Portfolio page - card should appear instantly!

---

## 📋 What's New

✅ **ImageKit Integration** - Images now upload to ImageKit CDN (fast, reliable, scalable)
✅ **Fixed Portfolio Sync** - Cards now properly display after upload
✅ **Better Event System** - Proper timing ensures data syncs correctly
✅ **Console Logging** - Debug info helps troubleshoot issues

---

## 🔍 Debug Checklist

If card doesn't appear after upload:

1. **Check Console Errors** (F12 → Console)
2. **Verify ImageKit Keys**
   ```
   backend/.env → Are credentials filled?
   ```
3. **Check localStorage**
   ```
   F12 → Application → localStorage → customPortfolioCards
   Is new card in the list?
   ```
4. **Backend Logs**
   ```
   Terminal: Is upload endpoint being called?
   Look for "Uploading image to ImageKit..." message
   ```

---

## 🎯 Expected Behavior

### Before (❌ Not Working)
- Upload card → stays in upload manager only
- Portfolio page doesn't refresh
- Base64 images stored locally

### After (✅ Fixed)
- Upload card → auto-appears in Portfolio page
- Both locations stay in sync
- Images stored on ImageKit CDN
- Load time much faster

---

## 📞 Support

For issues:
1. Check `PORTFOLIO_UPLOAD_CHANGES.md` for detailed documentation
2. Review error logs in browser console
3. Check backend terminal for upload errors
4. Verify ImageKit credentials are correct

---

**Status:** ✅ Ready to test!
