import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase URL or Key is missing. Check your .env file.\n' +
    'Make sure you have:\n' +
    'VITE_SUPABASE_URL=your_url\n' +
    'VITE_SUPABASE_KEY=your_key'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Type definitions
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface Settings {
  id: string;
  [key: string]: any;
}

// User profile operations
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  return data;
}

// Project operations
export async function addProject(project: Project): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project]);
  
  if (error) {
    console.error('Error adding project:', error);
    throw error;
  }
  return data?.[0] || null;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return data || [];
}

// Settings operations
export async function updateSettings(settings: Settings): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', settings.id);
  
  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
  return data?.[0] || null;
}

// Health check - verify connection
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code === '22P02') {
      // This is expected if table doesn't exist, but connection is working
      return true;
    }
    return !error;
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
}
