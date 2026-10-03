// =============================================
// VocaKids – Supabase Client
// Kết nối CSDL PostgreSQL Supabase Cloud
// Hỗ trợ cả biến môi trường & cài đặt trong UI
// =============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_STORAGE_URL_KEY = 'vocakids_supabase_url';
const SUPABASE_STORAGE_KEY_KEY = 'vocakids_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

/**
 * Lấy cấu hình Supabase từ env hoặc localStorage
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  if (typeof window !== 'undefined') {
    try {
      const storedUrl = localStorage.getItem(SUPABASE_STORAGE_URL_KEY) || '';
      const storedKey = localStorage.getItem(SUPABASE_STORAGE_KEY_KEY) || '';
      return { url: storedUrl.trim(), anonKey: storedKey.trim() };
    } catch {
      /* ignore */
    }
  }

  return { url: '', anonKey: '' };
}

/**
 * Lưu cấu hình Supabase vào localStorage (phục vụ cài đặt trên giao diện)
 */
export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url.trim());
      localStorage.setItem(SUPABASE_STORAGE_KEY_KEY, anonKey.trim());
      // Xóa client cache để khởi tạo lại
      cachedClient = null;
      cachedUrl = null;
      cachedKey = null;
    } catch {
      /* ignore */
    }
  }
}

/**
 * Kiểm tra xem Supabase đã được cấu hình chưa
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

/**
 * Lấy Supabase Client singleton
 */
export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('[Supabase Init Error]', err);
    return null;
  }
}

/**
 * Kiểm tra kết nối tới Supabase
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const url = customUrl || getSupabaseConfig().url;
    const key = customKey || getSupabaseConfig().anonKey;

    if (!url || !key) {
      return { success: false, message: 'Chưa nhập URL hoặc Anon Key' };
    }

    const testClient = createClient(url, key);
    // Thử truy vấn bảng user_profiles
    const { error } = await testClient.from('user_profiles').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "user_profiles" does not exist')) {
        return {
          success: true,
          message: 'Kết nối Supabase thành công! (Lưu ý: Cần chạy schema.sql trong SQL Editor để tạo bảng)',
        };
      }
      return { success: false, message: `Lỗi kết nối: ${error.message}` };
    }

    return { success: true, message: 'Kết nối Supabase Cloud & bảng dữ liệu thành công! 🎉' };
  } catch (err: any) {
    return { success: false, message: `Lỗi kết nối: ${err.message || String(err)}` };
  }
}
