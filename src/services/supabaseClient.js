// CivicEye Supabase Client & Cloud Storage Integration Service
// Connects to Supabase Cloud PostgreSQL, Realtime WebSockets, and 'civiceye-media' Storage Bucket.

import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'civiceye_supabase_url';
const STORAGE_KEY_KEY = 'civiceye_supabase_anon_key';

let supabaseInstance = null;

// Read Supabase credentials from Env or LocalStorage
export const getSupabaseConfig = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
  
  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) : '';
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : '';

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();

  return { url, anonKey };
};

// Save Supabase credentials to LocalStorage
export const setSupabaseConfig = (url, anonKey) => {
  if (typeof localStorage === 'undefined') return;
  if (url && url.trim()) {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
  } else {
    localStorage.removeItem(STORAGE_URL_KEY);
  }

  if (anonKey && anonKey.trim()) {
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_KEY);
  }

  // Reset instance to force re-initialization
  supabaseInstance = null;
};

// Check if valid Supabase configuration is present
export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && url.startsWith('http') && anonKey && anonKey.length > 20);
};

// Get or initialize Supabase Client singleton
export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

// Test connection to Supabase database
export const testSupabaseConnection = async (customUrl = null, customKey = null) => {
  const url = customUrl || getSupabaseConfig().url;
  const key = customKey || getSupabaseConfig().anonKey;

  if (!url || !key) {
    return { success: false, message: 'Missing Supabase URL or Anon Key.' };
  }

  try {
    const tempClient = createClient(url, key);
    const { data, error } = await tempClient.from('clusters').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, it's connected but schema not run
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'Connected to Supabase! Please run the schema.sql in Supabase SQL Editor to create the tables.',
          needsSchema: true 
        };
      }
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: 'Successfully connected to Supabase PostgreSQL Data Lake!',
      count: data ? data.length : 0 
    };
  } catch (e) {
    return { success: false, message: e.message || 'Connection test failed' };
  }
};

// Upload media (File, Blob, or base64 data URL) to Supabase Storage Bucket ('civiceye-media')
export const uploadMediaToSupabase = async (mediaData, customFilename = null) => {
  if (!mediaData) return null;

  const client = getSupabaseClient();
  if (!client) {
    // If Supabase not connected, return original mediaData (base64 or URL)
    return mediaData;
  }

  try {
    let blob = null;
    let contentType = 'image/jpeg';
    let ext = 'jpg';

    if (typeof mediaData === 'string') {
      if (mediaData.startsWith('http://') || mediaData.startsWith('https://')) {
        // Already a remote URL
        return mediaData;
      }
      if (mediaData.startsWith('data:')) {
        // Parse base64 Data URL
        const match = mediaData.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          contentType = match[1];
          ext = contentType.split('/')[1] || 'jpg';
          const byteCharacters = atob(match[2]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          blob = new Blob([byteArray], { type: contentType });
        }
      }
    } else if (mediaData instanceof Blob || mediaData instanceof File) {
      blob = mediaData;
      contentType = mediaData.type || 'image/jpeg';
      ext = contentType.split('/')[1] || 'jpg';
    }

    if (!blob) {
      return mediaData;
    }

    const filename = customFilename || `upload-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
    const filePath = `reports/${filename}`;

    const { error: uploadError } = await client.storage
      .from('civiceye-media')
      .upload(filePath, blob, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return mediaData; // Fallback to raw base64
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('civiceye-media')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || mediaData;
  } catch (err) {
    console.warn('Exception during media upload to Supabase:', err);
    return mediaData;
  }
};

// Real-time Table Subscription Helper
export const subscribeToSupabaseTable = (tableName, onPayload) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channelName = `public:${tableName}-${Date.now()}`;
  const channel = client
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        if (onPayload) {
          onPayload(payload);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
