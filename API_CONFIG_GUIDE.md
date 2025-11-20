# Centralized API Configuration Guide

## Overview
All API URLs and configurations are now centralized in a single file: `src/config/apiConfig.ts`

This means you only need to change URLs in **ONE PLACE** instead of updating them in multiple components.

## File Structure
```
src/
├── config/
│   └── apiConfig.ts          ← Centralized API configuration
├── .env.local                ← Local development environment variables
├── .env.production           ← Production environment variables
└── vite-env.d.ts            ← TypeScript definitions for env variables
```

## How It Works

### 1. Environment Variables (.env files)
Both `.env.local` and `.env.production` contain:
```env
VITE_API_URL=https://makstarkrepo2.vercel.app
```

For local development, use:
```env
VITE_API_URL=http://localhost:8000
```

### 2. Centralized Config (src/config/apiConfig.ts)
Reads environment variables and exports API endpoints:

```typescript
export const API_BASE_URL = "https://makstarkrepo2.vercel.app" (from env)
export const API_ENDPOINTS = {
  auth: {
    login: "https://makstarkrepo2.vercel.app/auth/login",
    token: "https://makstarkrepo2.vercel.app/token",
    me: "https://makstarkrepo2.vercel.app/me",
  },
  offer: {
    generate: "https://makstarkrepo2.vercel.app/offer/generate-offer",
    generateOffPage: "https://makstarkrepo2.vercel.app/generate-offer",
  },
  // ... more endpoints
}
```

### 3. Using in Components
Import and use the centralized config:

```typescript
import { API_ENDPOINTS, getAuthHeaders } from '@/config/apiConfig';

// In your component:
const res = await fetch(API_ENDPOINTS.auth.login, {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify(data),
});
```

## Updated Components
The following components have been updated to use the centralized config:
- ✅ `src/api/supabaseApi.ts`
- ✅ `src/components/LoginPage.tsx`
- ✅ `src/components/DashboardPage.tsx`
- ✅ `src/components/NewEntryPage.tsx`
- ✅ `src/components/offer-letter.tsx`

## How to Add More API Endpoints
Simply add new endpoints to the `API_ENDPOINTS` object in `src/config/apiConfig.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  newFeature: {
    getData: `${API_BASE_URL}/new-feature/get-data`,
    postData: `${API_BASE_URL}/new-feature/post-data`,
  }
}
```

Then use it in your component:
```typescript
import { API_ENDPOINTS } from '@/config/apiConfig';

// Usage:
fetch(API_ENDPOINTS.newFeature.getData)
```

## Changing the API URL
To change the API URL, simply update:
1. `.env.local` (for local development)
2. `.env.production` (for production builds)

No need to update individual components! 🎉

## Helper Functions
The config also provides helper functions:

```typescript
// Get authentication token from localStorage
const token = getAuthToken();

// Get headers with auth token included
const headers = getAuthHeaders();
// Returns: { "Content-Type": "application/json", Authorization: "Bearer <token>" }
```

## Environment Variable Types
TypeScript types for environment variables are defined in `src/vite-env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
}
```

## Production Deployment
When deploying to Vercel:
1. Go to your project settings
2. Add environment variables in "Environment Variables" section
3. Set `VITE_API_URL=https://makstarkrepo2.vercel.app` (or your actual API URL)
4. Vercel will automatically use these variables during build
