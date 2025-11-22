/**
 * Centralized API Configuration
 * All API URLs and configuration in one place
 * Change here once, applies everywhere
 */

// Backend API URL - uses environment variable or defaults to localhost
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

// Supabase Configuration
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "";
export const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_KEY as string) || "";
export const SUPABASE_PROJECT_ID = SUPABASE_URL.split("https://")[1]?.split(".supabase.co")[0] || "";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    token: `${API_BASE_URL}/token`,
    me: `${API_BASE_URL}/me`,
  },
  // Offer letter endpoints
  offer: {
    generate: `${API_BASE_URL}/offer/generate-offer`,
    generateOffPage: `${API_BASE_URL}/generate-offer`,
    generateEntryPdf: `${API_BASE_URL}/offer/generate-entry-pdf`,
    processEntry: `${API_BASE_URL}/offer/process-entry`,
  },
  // PDF endpoints
  pdf: {
    generate: `${API_BASE_URL}/pdf/generate-pdf`,
  },
  // Calculate endpoints
  calculate: {
    amount: `${API_BASE_URL}/calculate-amount`,
  },
  // Image upload endpoints
  upload: {
    base64Image: `${API_BASE_URL}/upload-base64-image`,
    file: `${API_BASE_URL}/upload-image`,
  },
  // Supabase functions
  supabase: {
    processEntry: `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-e9eea15d/process-entry`,
    generatePdf: `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-e9eea15d/generate-pdf`,
  },
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to get headers with auth token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
