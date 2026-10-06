// =============================================
// VocaKids – Direct PostgreSQL Database Client
// Hỗ trợ kết nối trực tiếp PostgreSQL trên Coolify,
// Docker, VPS hoặc bất kỳ nhà cung cấp nào (Neon, Supabase...)
// =============================================

import { Pool, PoolConfig } from 'pg';
import { UserProfile, AppProgress, WordProgress, DailyStats } from '@/types';
import { AuthAccount } from '@/lib/auth';

let pool: Pool | null = null;
let schemaInitialized = false;

/**
 * Lấy chuỗi kết nối PostgreSQL từ biến môi trường
 */
export function getPostgresConnectionString(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PG_CONNECTION_STRING ||
    ''
  ).trim();
}

/**
 * Kiểm tra xem cấu hình PostgreSQL đã được thiết lập chưa
 */
export function isPostgresConfigured(): boolean {
  const url = getPostgresConnectionString();
  return Boolean(url && (url.startsWith('postgres://') || url.startsWith('postgresql://')));
}

/**
 * Lấy singleton PostgreSQL Pool
 */
export function getPostgresPool(): Pool | null {
  if (pool) return pool;

  const connectionString = getPostgresConnectionString();
  if (!connectionString) return null;

  try {
    const isLocalhost =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1') ||
      connectionString.includes('@postgres:');

    const config: PoolConfig = {
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    };

    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('[PostgreSQL Pool Unexpected Error]', err);
    });

    return pool;
  } catch (err) {
    console.error('[PostgreSQL Init Error]', err);
    return null;
  }
}

/**
 * Tự động tạo bảng dữ liệu nếu chưa tồn tại
 */
export async function initPostgresSchema(): Promise<{ success: boolean; message: string }> {
  const p = getPostgresPool();
  if (!p) {
    return { success: false, message: 'Chưa cấu hình DATABASE_URL' };
  }

  if (schemaInitialized) {
    return { success: true, message: 'Schema already initialized' };
  }

  const client = await p.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL DEFAULT '🐰',
        grade_id TEXT NOT NULL DEFAULT 'lop1',
        color TEXT NOT NULL DEFAULT 'from-orange-400 to-amber-500',
        code TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        cat_id TEXT NOT NULL,
        word_id TEXT NOT NULL,
        stars INTEGER NOT NULL DEFAULT 0,
        attempts INTEGER NOT NULL DEFAULT 0,
        best_score INTEGER NOT NULL DEFAULT 0,
        consecutive_passes INTEGER NOT NULL DEFAULT 0,
        mastered BOOLEAN NOT NULL DEFAULT FALSE,
        mastered_at TIMESTAMPTZ,
        review_due_date TEXT,
        interval_days INTEGER NOT NULL DEFAULT 1,
        last_practiced TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_profile_word UNIQUE(profile_id, cat_id, word_id)
      );

      CREATE TABLE IF NOT EXISTS user_stickers (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        sticker_id TEXT NOT NULL,
        unlocked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_daily_stats (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        words_studied INTEGER NOT NULL DEFAULT 0,
        total_stars INTEGER NOT NULL DEFAULT 0,
        streak INTEGER NOT NULL DEFAULT 1,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_profile_date UNIQUE(profile_id, date)
      );

      CREATE TABLE IF NOT EXISTS custom_categories (
        id TEXT PRIMARY KEY,
        profile_id TEXT REFERENCES user_profiles(id) ON DELETE CASCADE,
        name_vi TEXT NOT NULL,
        name_en TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '📚',
        source_type TEXT DEFAULT 'manual',
        source_label TEXT,
        grade_id TEXT DEFAULT 'custom',
        words JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_pg_progress_profile ON user_progress(profile_id);
      CREATE INDEX IF NOT EXISTS idx_pg_stickers_profile ON user_stickers(profile_id);
      CREATE INDEX IF NOT EXISTS idx_pg_daily_profile ON user_daily_stats(profile_id);

      CREATE TABLE IF NOT EXISTS learning_sessions (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_learning_profile ON learning_sessions(profile_id);
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS learning_reward_keys JSONB NOT NULL DEFAULT '[]';
    `);

    // ── Auth tables (parent accounts + sessions) ──────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS parent_accounts (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT DEFAULT '',
        admin_pin TEXT DEFAULT '1234',
        account_type TEXT DEFAULT 'registered',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS auth_sessions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES parent_accounts(id) ON DELETE CASCADE,
        device_info TEXT DEFAULT '',
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_account ON auth_sessions(account_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON auth_sessions(expires_at);
    `);

    // Add owner_id column to user_profiles if not exists (for linking to parent_accounts)
    await client.query(`
      ALTER TABLE user_profiles
        ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES parent_accounts(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS idx_profiles_owner ON user_profiles(owner_id);
    `);

    // Tạo hồ sơ mặc định nếu chưa có hồ sơ nào
    const countCheck = await client.query('SELECT COUNT(*) as count FROM user_profiles');
    if (parseInt(countCheck.rows[0]?.count || '0', 10) === 0) {
      await client.query(`
        INSERT INTO user_profiles (id, name, avatar, grade_id, color, code)
        VALUES ('child_be_bong', 'Bé Bông', '🐰', 'lop5', 'from-amber-400 via-orange-400 to-amber-500', 'BONG35')
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    schemaInitialized = true;
    return { success: true, message: 'Khởi tạo schema PostgreSQL thành công!' };
  } catch (err: any) {
    console.error('[PostgreSQL Schema Init Error]', err);
    return { success: false, message: `Lỗi khởi tạo schema: ${err?.message || err}` };
  } finally {
    client.release();
  }
}

/**
 * Kiểm tra kết nối tới PostgreSQL Database
 */
export async function testPostgresConnection(): Promise<{
  success: boolean;
  message: string;
  version?: string;
  connectionUrlMasked?: string;
}> {
  const p = getPostgresPool();
  if (!p) {
    return {
      success: false,
      message: 'Chưa có biến môi trường DATABASE_URL hoặc POSTGRES_URL trên server.',
    };
  }

  const rawUrl = getPostgresConnectionString();
  const masked = rawUrl.replace(/:([^:@]+)@/, ':***@');

  try {
    const res = await p.query('SELECT NOW() as current_time, version()');
    await initPostgresSchema();
    const ver = res.rows[0]?.version || '';
    return {
      success: true,
      message: 'Kết nối PostgreSQL thành công & các bảng dữ liệu đã sẵn sàng! 🎉',
      version: ver.split(' on ')[0] || ver,
      connectionUrlMasked: masked,
    };
  } catch (err: any) {
    console.error('[PostgreSQL Test Error]', err);
    return {
      success: false,
      message: `Không thể kết nối đến PostgreSQL: ${err?.message || err}`,
      connectionUrlMasked: masked,
    };
  }
}

// ── CRUD Helpers for PostgreSQL ─────────────────────────────────

export async function pgGetProfiles(query?: string): Promise<UserProfile[]> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  let sql = 'SELECT * FROM user_profiles ORDER BY created_at ASC';
  const params: any[] = [];

  if (query) {
    sql = 'SELECT * FROM user_profiles WHERE name ILIKE $1 OR UPPER(code) = UPPER($2) OR id = $3 ORDER BY created_at ASC';
    params.push(`%${query}%`, query, query);
  }

  const res = await p.query(sql, params);

  // Lấy tổng số sao cho từng profile
  const starRes = await p.query('SELECT profile_id, COALESCE(SUM(stars), 0) as total_stars FROM user_progress GROUP BY profile_id');
  const starsMap: Record<string, number> = {};
  for (const row of starRes.rows) {
    starsMap[row.profile_id] = parseInt(row.total_stars, 10);
  }

  return res.rows.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar || '🐰',
    gradeId: row.grade_id || 'lop1',
    color: row.color || 'from-orange-400 to-amber-500',
    code: row.code,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2026-10-02',
    totalStars: starsMap[row.id] || 0,
    streak: 1,
  }));
}

export async function pgLoginProfile(query: string): Promise<{ profile: UserProfile; progress: AppProgress } | null> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const qTrim = query.trim();
  const qCode = qTrim.toUpperCase();

  const res = await p.query(
    'SELECT * FROM user_profiles WHERE UPPER(code) = $1 OR name ILIKE $2 OR id = $3 LIMIT 1',
    [qCode, `%${qTrim}%`, qTrim]
  );

  if (res.rows.length === 0) return null;

  const row = res.rows[0];
  const profile: UserProfile = {
    id: row.id,
    name: row.name,
    avatar: row.avatar || '🐰',
    gradeId: row.grade_id || 'lop1',
    color: row.color || 'from-orange-400 to-amber-500',
    code: row.code,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2026-10-02',
  };

  // Lấy progress
  const progRes = await p.query('SELECT * FROM user_progress WHERE profile_id = $1', [profile.id]);
  const wordProgress: Record<string, WordProgress> = {};
  let totalStars = 0;

  for (const pr of progRes.rows) {
    wordProgress[pr.word_id] = {
      wordId: pr.word_id,
      catId: pr.cat_id,
      stars: pr.stars || 0,
      attempts: pr.attempts || 0,
      bestScore: pr.best_score || 0,
      lastPracticed: pr.last_practiced ? new Date(pr.last_practiced).toISOString().split('T')[0] : '',
      consecutivePasses: pr.consecutive_passes || 0,
      mastered: Boolean(pr.mastered),
      masteredAt: pr.mastered_at ? new Date(pr.mastered_at).toISOString().split('T')[0] : undefined,
      reviewDueDate: pr.review_due_date || undefined,
      intervalDays: pr.interval_days || 1,
    };
    totalStars += pr.stars || 0;
  }

  // Lấy stickers
  const stickRes = await p.query('SELECT sticker_id FROM user_stickers WHERE profile_id = $1', [profile.id]);
  const stickers = stickRes.rows.map((r) => r.sticker_id);

  // Lấy daily stats
  const dailyRes = await p.query(
    'SELECT * FROM user_daily_stats WHERE profile_id = $1 ORDER BY date DESC LIMIT 30',
    [profile.id]
  );
  const dailyStats: DailyStats[] = dailyRes.rows.map((d) => ({
    date: d.date,
    wordsStudied: d.words_studied,
    totalStars: d.total_stars,
    streak: d.streak || 1,
  }));

  const progress: AppProgress = {
    learningSessions: Object.fromEntries((await p.query('SELECT id, payload FROM learning_sessions WHERE profile_id = $1', [profile.id])).rows.map(r => [r.id, r.payload])),
    learningRewardKeys: row.learning_reward_keys || [],
    totalStars: totalStars + (Array.isArray(row.learning_reward_keys) ? row.learning_reward_keys.length : 0),
    streak: dailyStats.length > 0 ? dailyStats[0].streak : 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    wordProgress,
    dailyStats,
    stickers: stickers as any,
    badges: [],
    unitTestResults: {},
    unlockedUnits: [],
    totalPoints: totalStars * 10,
  };

  return { profile, progress };
}

export async function pgCreateProfile(profile: UserProfile & { ownerId?: string }, initialProg?: AppProgress): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  await p.query(
    `INSERT INTO user_profiles (id, name, avatar, grade_id, color, code, owner_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       avatar = EXCLUDED.avatar,
       grade_id = EXCLUDED.grade_id,
       color = EXCLUDED.color,
       code = EXCLUDED.code,
       owner_id = COALESCE(EXCLUDED.owner_id, user_profiles.owner_id),
       updated_at = NOW()`,
    [profile.id, profile.name, profile.avatar, profile.gradeId, profile.color, profile.code, profile.ownerId || null]
  );

  if (initialProg?.wordProgress) {
    for (const wp of Object.values(initialProg.wordProgress)) {
      const progId = `${profile.id}:${wp.wordId}`;
      await p.query(
        `INSERT INTO user_progress (id, profile_id, cat_id, word_id, stars, attempts, best_score, last_practiced, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (profile_id, cat_id, word_id) DO UPDATE SET
           stars = EXCLUDED.stars,
           attempts = EXCLUDED.attempts,
           best_score = EXCLUDED.best_score,
           updated_at = NOW()`,
        [progId, profile.id, wp.catId, wp.wordId, wp.stars, wp.attempts, wp.bestScore]
      );
    }
  }
}

export async function pgSyncProgress(
  profileId: string,
  incomingProg: AppProgress,
  profileData?: Partial<UserProfile>
): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  // 1. Cập nhật profile nếu có
  if (profileData && profileData.name) {
    await p.query(
      `INSERT INTO user_profiles (id, name, avatar, grade_id, color, code, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         avatar = EXCLUDED.avatar,
         grade_id = EXCLUDED.grade_id,
         color = EXCLUDED.color,
         code = COALESCE(EXCLUDED.code, user_profiles.code),
         updated_at = NOW()`,
      [
        profileId,
        profileData.name,
        profileData.avatar || '🐰',
        profileData.gradeId || 'lop1',
        profileData.color || 'from-orange-400 to-amber-500',
        profileData.code || null,
      ]
    );
  }

  // 2. Batch/upsert word progress
  if (incomingProg.wordProgress) {
    for (const wp of Object.values(incomingProg.wordProgress)) {
      const progId = `${profileId}:${wp.wordId}`;
      await p.query(
        `INSERT INTO user_progress (
           id, profile_id, cat_id, word_id, stars, attempts, best_score,
           consecutive_passes, mastered, mastered_at, review_due_date, interval_days,
           last_practiced, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         ON CONFLICT (profile_id, cat_id, word_id) DO UPDATE SET
           stars = GREATEST(user_progress.stars, EXCLUDED.stars),
           attempts = GREATEST(user_progress.attempts, EXCLUDED.attempts),
           best_score = GREATEST(user_progress.best_score, EXCLUDED.best_score),
           consecutive_passes = EXCLUDED.consecutive_passes,
           mastered = EXCLUDED.mastered OR user_progress.mastered,
           mastered_at = COALESCE(EXCLUDED.mastered_at, user_progress.mastered_at),
           review_due_date = COALESCE(EXCLUDED.review_due_date, user_progress.review_due_date),
           interval_days = GREATEST(user_progress.interval_days, EXCLUDED.interval_days),
           last_practiced = NOW(),
           updated_at = NOW()`,
        [
          progId,
          profileId,
          wp.catId,
          wp.wordId,
          wp.stars || 0,
          wp.attempts || 0,
          wp.bestScore || 0,
          wp.consecutivePasses || 0,
          Boolean(wp.mastered),
          wp.masteredAt ? new Date(wp.masteredAt) : null,
          wp.reviewDueDate || null,
          wp.intervalDays || 1,
        ]
      );
    }
  }

  // 3. Upsert stickers
  for (const session of Object.values(incomingProg.learningSessions ?? {})) {
    if (session.profileId !== profileId) continue;
    await p.query(
      `INSERT INTO learning_sessions (id, profile_id, payload, updated_at) VALUES ($1, $2, $3::jsonb, $4)
       ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at
       WHERE learning_sessions.profile_id = EXCLUDED.profile_id AND learning_sessions.updated_at < EXCLUDED.updated_at`,
      [session.id, profileId, JSON.stringify(session), session.updatedAt]
    );
  }
  if (incomingProg.learningRewardKeys) {
    await p.query(`UPDATE user_profiles SET learning_reward_keys =
      (SELECT COALESCE(jsonb_agg(DISTINCT value), '[]'::jsonb) FROM jsonb_array_elements(learning_reward_keys || $2::jsonb)) WHERE id = $1`,
      [profileId, JSON.stringify(incomingProg.learningRewardKeys)]);
  }

  if (incomingProg.stickers && Array.isArray(incomingProg.stickers)) {
    for (const stick of incomingProg.stickers) {
      const stickerId = typeof stick === 'string' ? stick : (stick as any).id;
      if (!stickerId) continue;
      const id = `${profileId}:${stickerId}`;
      await p.query(
        `INSERT INTO user_stickers (id, profile_id, sticker_id, unlocked_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [id, profileId, stickerId]
      );
    }
  }

  // 4. Upsert daily stats
  if (incomingProg.dailyStats && Array.isArray(incomingProg.dailyStats)) {
    for (const ds of incomingProg.dailyStats) {
      const id = `${profileId}:${ds.date}`;
      await p.query(
        `INSERT INTO user_daily_stats (id, profile_id, date, words_studied, total_stars, streak, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (profile_id, date) DO UPDATE SET
           words_studied = GREATEST(user_daily_stats.words_studied, EXCLUDED.words_studied),
           total_stars = GREATEST(user_daily_stats.total_stars, EXCLUDED.total_stars),
           streak = GREATEST(user_daily_stats.streak, EXCLUDED.streak),
           updated_at = NOW()`,
        [id, profileId, ds.date, ds.wordsStudied || 0, ds.totalStars || 0, ds.streak || 1]
      );
    }
  }
}

export async function pgUpdateProfile(profileId: string, data: Partial<UserProfile>): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${idx++}`);
    params.push(data.name);
  }
  if (data.avatar !== undefined) {
    fields.push(`avatar = $${idx++}`);
    params.push(data.avatar);
  }
  if (data.gradeId !== undefined) {
    fields.push(`grade_id = $${idx++}`);
    params.push(data.gradeId);
  }
  if (data.color !== undefined) {
    fields.push(`color = $${idx++}`);
    params.push(data.color);
  }
  if (data.code !== undefined) {
    fields.push(`code = $${idx++}`);
    params.push(data.code.toUpperCase());
  }

  if (fields.length === 0) return;

  fields.push('updated_at = NOW()');
  params.push(profileId);

  await p.query(
    `UPDATE user_profiles SET ${fields.join(', ')} WHERE id = $${idx}`,
    params
  );
}

export async function pgDeleteProfile(profileId: string): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  await p.query('DELETE FROM user_profiles WHERE id = $1', [profileId]);
}

// ── Auth / Parent Account CRUD ────────────────────────────────────────────────

/** Tạo tài khoản phụ huynh mới */
export async function pgCreateParentAccount(data: {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
}): Promise<AuthAccount> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const res = await p.query(
    `INSERT INTO parent_accounts (id, email, password_hash, display_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.id, data.email.toLowerCase().trim(), data.passwordHash, data.displayName.trim()]
  );
  return rowToAccount(res.rows[0]);
}

/** Lấy tài khoản theo email (để đăng nhập) */
export async function pgGetParentAccountByEmail(email: string): Promise<{
  account: AuthAccount;
  passwordHash: string;
} | null> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const res = await p.query(
    'SELECT * FROM parent_accounts WHERE email = $1 LIMIT 1',
    [email.toLowerCase().trim()]
  );
  if (!res.rows[0]) return null;
  return {
    account: rowToAccount(res.rows[0]),
    passwordHash: res.rows[0].password_hash,
  };
}

/** Lấy tài khoản theo ID */
export async function pgGetParentAccountById(id: string): Promise<AuthAccount | null> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const res = await p.query(
    'SELECT * FROM parent_accounts WHERE id = $1 LIMIT 1',
    [id]
  );
  if (!res.rows[0]) return null;
  return rowToAccount(res.rows[0]);
}

/** Lấy tất cả hồ sơ bé thuộc một tài khoản phụ huynh */
export async function pgGetProfilesByOwner(ownerId: string): Promise<UserProfile[]> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const res = await p.query(
    'SELECT * FROM user_profiles WHERE owner_id = $1 ORDER BY created_at ASC',
    [ownerId]
  );

  // Get star totals
  const starRes = await p.query(
    `SELECT profile_id, COALESCE(SUM(stars), 0) as total_stars
     FROM user_progress
     WHERE profile_id = ANY($1::text[])
     GROUP BY profile_id`,
    [res.rows.map((r: any) => r.id)]
  );
  const starsMap: Record<string, number> = {};
  for (const row of starRes.rows) {
    starsMap[row.profile_id] = parseInt(row.total_stars, 10);
  }

  return res.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar || '🐰',
    gradeId: row.grade_id || 'lop1',
    color: row.color || 'orange',
    code: row.code,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  }));
}

/** Tạo hồ sơ bé mới gắn với tài khoản phụ huynh */
export async function pgCreateProfileForOwner(data: {
  id: string;
  name: string;
  avatar: string;
  gradeId: string;
  color: string;
  code: string;
  ownerId: string;
}): Promise<UserProfile> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  const res = await p.query(
    `INSERT INTO user_profiles (id, name, avatar, grade_id, color, code, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [data.id, data.name, data.avatar, data.gradeId, data.color, data.code, data.ownerId]
  );
  const row = res.rows[0];
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    gradeId: row.grade_id,
    color: row.color,
    code: row.code,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  };
}

/** Kiểm tra email đã tồn tại chưa */
export async function pgCheckEmailExists(email: string): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) return false;
  await initPostgresSchema();

  const res = await p.query(
    'SELECT 1 FROM parent_accounts WHERE email = $1 LIMIT 1',
    [email.toLowerCase().trim()]
  );
  return res.rows.length > 0;
}

/** Cập nhật admin PIN của tài khoản */
export async function pgUpdateAdminPin(accountId: string, newPin: string): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');

  await p.query(
    'UPDATE parent_accounts SET admin_pin = $1, updated_at = NOW() WHERE id = $2',
    [newPin, accountId]
  );
}

/** Cập nhật mật khẩu tài khoản */
export async function pgUpdatePassword(accountId: string, newHash: string): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');

  await p.query(
    'UPDATE parent_accounts SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, accountId]
  );
}

/** Gán hồ sơ bé vào tài khoản phụ huynh (dùng khi chuyển từ Guest sang Cá nhân) */
export async function pgLinkProfileToOwner(profileId: string, ownerId: string): Promise<void> {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL chưa được cấu hình');
  await initPostgresSchema();

  await p.query(
    'UPDATE user_profiles SET owner_id = $1, updated_at = NOW() WHERE id = $2',
    [ownerId, profileId]
  );
}

/** Helper: Chuyển DB row thành AuthAccount object */
function rowToAccount(row: any): AuthAccount {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || '',
    adminPin: row.admin_pin || '1234',
    accountType: 'registered',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}
