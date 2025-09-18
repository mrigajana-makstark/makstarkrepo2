import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Fetch user profile by ID
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// Example: Insert a new project
export async function addProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project]);
  if (error) throw error;
  return data;
}

// Example: Update company settings
export async function updateSettings(settings) {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', settings.id);
  if (error) throw error;
  return data;
}