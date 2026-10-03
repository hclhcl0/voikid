-- ================================================================
-- VocaKids – Supabase Database Schema (PostgreSQL)
-- Chạy mã SQL này trong Supabase Dashboard -> SQL Editor -> Run
-- ================================================================

-- 1. BẢNG HỒ SƠ CÁC BÉ (user_profiles)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🐰',
  grade_id TEXT NOT NULL DEFAULT 'lop1',
  color TEXT NOT NULL DEFAULT 'from-orange-400 to-amber-500',
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. BẢNG TIẾN TRÌNH HỌC TỪNG TỪ (user_progress)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id TEXT PRIMARY KEY, -- Format: profile_id:word_id
  profile_id TEXT NOT NULL,
  cat_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_progress_profile ON public.user_progress (profile_id);
CREATE INDEX IF NOT EXISTS idx_progress_cat ON public.user_progress (cat_id);

-- 3. BẢNG BỘ SƯU TẬP STICKER HUY HIỆU (user_stickers)
CREATE TABLE IF NOT EXISTS public.user_stickers (
  id TEXT PRIMARY KEY, -- Format: profile_id:sticker_id
  profile_id TEXT NOT NULL,
  sticker_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_stickers_profile ON public.user_stickers (profile_id);

-- 4. BẢNG THỐNG KÊ NGÀY & CHUỖI STREAK (user_daily_stats)
CREATE TABLE IF NOT EXISTS public.user_daily_stats (
  id TEXT PRIMARY KEY, -- Format: profile_id:YYYY-MM-DD
  profile_id TEXT NOT NULL,
  date TEXT NOT NULL,
  words_studied INTEGER NOT NULL DEFAULT 0,
  total_stars INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_daily_profile ON public.user_daily_stats (profile_id);

-- 5. BẢNG TỪ VỰNG & CHỦ ĐỀ TÙY CHỈNH CỦA PHỤ HUYNH (custom_categories)
CREATE TABLE IF NOT EXISTS public.custom_categories (
  id TEXT PRIMARY KEY,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📚',
  grade_id TEXT NOT NULL DEFAULT 'custom',
  words JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Bật RLS và cấp quyền đọc/ghi công khai (qua Anon Key)
-- ================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách Allow All cho Anon Key (dành cho app học từ vựng cho trẻ em)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access user_profiles') THEN
    CREATE POLICY "Allow public access user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access user_progress') THEN
    CREATE POLICY "Allow public access user_progress" ON public.user_progress FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access user_stickers') THEN
    CREATE POLICY "Allow public access user_stickers" ON public.user_stickers FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access user_daily_stats') THEN
    CREATE POLICY "Allow public access user_daily_stats" ON public.user_daily_stats FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access custom_categories') THEN
    CREATE POLICY "Allow public access custom_categories" ON public.custom_categories FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Thêm dữ liệu mẫu khởi tạo cho Bé Bông nếu chưa có
INSERT INTO public.user_profiles (id, name, avatar, grade_id, color, code)
VALUES ('child_be_bong', 'Bé Bông', '🐰', 'lop5', 'from-amber-400 via-orange-400 to-amber-500', 'BONG35')
ON CONFLICT (id) DO NOTHING;
