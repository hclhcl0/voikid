'use client';

// =============================================
// VocaKids – AuthContext
// Quản lý phiên đăng nhập người dùng cá nhân
// (Guest mode hoặc Registered với email/password)
// =============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { UserProfile, AppProgress } from '@/types';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AccountInfo {
  role?: 'parent' | 'student';
  parentId?: string;
  profileId?: string;
  id: string;
  email: string;
  displayName: string;
  adminPin?: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  account?: AccountInfo;
  profiles?: UserProfile[];
  firstProfile?: UserProfile;
}

interface AuthContextType {
  // State
  account: AccountInfo | null;   // null = guest
  isGuest: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Modal controls
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Actions
  register(params: {
    email: string;
    password: string;
    displayName: string;
    childName: string;
    childAvatar?: string;
    childGradeId?: string;
    childColor?: string;
  }): Promise<AuthResult>;

  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshSession(): Promise<void>;
  migrateGuestToAccount(profile: UserProfile, progress: AppProgress): Promise<{ success: boolean; message: string }>;

  // Cloud profiles (only populated for registered users)
  cloudProfiles: UserProfile[];
  reloadCloudProfiles(): Promise<void>;
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true during initial session check
  const [cloudProfiles, setCloudProfiles] = useState<UserProfile[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // ── Refresh session on mount ─────────────────────────────────────────────────
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.account) {
          setAccount(data.account);
          setCloudProfiles(data.profiles || []);
          return;
        }
      }
    } catch {
      // Offline or server error — treat as guest
    }
    setAccount(null);
    setCloudProfiles([]);
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  // ── Reload Cloud Profiles ─────────────────────────────────────────────────────
  const reloadCloudProfiles = useCallback(async () => {
    if (!account) return;
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCloudProfiles(data.profiles || []);
        }
      }
    } catch {
      // Ignore
    }
  }, [account]);

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = useCallback(async (params: {
    email: string;
    password: string;
    displayName: string;
    childName: string;
    childAvatar?: string;
    childGradeId?: string;
    childColor?: string;
  }): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...params, action: 'register' }),
      });

      const data = await res.json();
      if (data.success && data.account) {
        setAccount(data.account);
        if (data.firstProfile) {
          setCloudProfiles([data.firstProfile]);
        }
        setIsAuthModalOpen(false);
      }

      return data;
    } catch (err: any) {
      return { success: false, message: `Lỗi kết nối: ${err?.message || 'Không thể đăng ký'}` };
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      let data = await res.json();
      if (!data.success && res.status === 401) {
        const legacy = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email, password }) });
        if (legacy.ok) data = await legacy.json();
      }

      if (data.success && data.account) {
        setAccount(data.account);
        setCloudProfiles(data.profiles || []);
        setIsAuthModalOpen(false);
      }

      return data;
    } catch (err: any) {
      return { success: false, message: `Lỗi kết nối: ${err?.message || 'Không thể đăng nhập'}` };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore network errors
    }
    setAccount(null);
    setCloudProfiles([]);
  }, []);

  // ── Migrate Guest Profile to Account ──────────────────────────────────────────
  const migrateGuestToAccount = useCallback(async (profile: UserProfile, progress: AppProgress) => {
    try {
      const res = await fetch('/api/auth/link-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profile, progress }),
      });
      const data = await res.json();
      if (data.success) {
        await reloadCloudProfiles();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err?.message || 'Không thể liên kết hồ sơ' };
    }
  }, [reloadCloudProfiles]);

  // ── Context Value ─────────────────────────────────────────────────────────────
  const value = useMemo<AuthContextType>(() => ({
    account,
    isGuest: !account,
    isLoading,
    isAuthenticated: !!account,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    register,
    login,
    logout,
    refreshSession,
    migrateGuestToAccount,
    cloudProfiles,
    reloadCloudProfiles,
  }), [
    account,
    isLoading,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    register,
    login,
    logout,
    refreshSession,
    migrateGuestToAccount,
    cloudProfiles,
    reloadCloudProfiles,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Safe fallback for components rendered outside AuthProvider
    return {
      account: null,
      isGuest: true,
      isLoading: false,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login',
      openAuthModal: () => {},
      closeAuthModal: () => {},
      register: async () => ({ success: false, message: 'AuthProvider không tìm thấy' }),
      login: async () => ({ success: false, message: 'AuthProvider không tìm thấy' }),
      logout: async () => {},
      refreshSession: async () => {},
      migrateGuestToAccount: async () => ({ success: false, message: 'AuthProvider không tìm thấy' }),
      cloudProfiles: [],
      reloadCloudProfiles: async () => {},
    };
  }
  return ctx;
}
