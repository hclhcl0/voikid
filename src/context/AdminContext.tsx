'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ADMIN_PIN_STORAGE_KEY = 'vocakids_admin_pin_v1';
export const ADMIN_SESSION_STORAGE_KEY = 'vocakids_admin_session_v1';
export const DEFAULT_ADMIN_PIN = '1234';

interface AdminContextType {
  isAdmin: boolean;
  adminPin: string;
  hasCustomPin: boolean;
  verifyPin: (pin: string) => boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changePin: (oldPin: string, newPin: string) => { success: boolean; message: string };
  resetPinToDefault: () => void;
  
  // Parent Gate Modal Trigger
  isAdminModalOpen: boolean;
  openAdminModal: (callback?: () => void) => void;
  closeAdminModal: () => void;
  onSuccessCallback: (() => void) | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>(DEFAULT_ADMIN_PIN);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedPin = localStorage.getItem(ADMIN_PIN_STORAGE_KEY);
      if (storedPin) {
        setAdminPin(storedPin);
      } else {
        localStorage.setItem(ADMIN_PIN_STORAGE_KEY, DEFAULT_ADMIN_PIN);
      }

      // Check session
      const session = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (session === 'true') {
        setIsAdmin(true);
      }
    } catch (e) {
      console.error('Error hydrating admin state:', e);
    }
    setHydrated(true);
  }, []);

  const verifyPin = useCallback((pin: string): boolean => {
    return pin.trim() === adminPin;
  }, [adminPin]);

  const loginAdmin = useCallback((pin: string): boolean => {
    if (verifyPin(pin)) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  }, [verifyPin]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    } catch {}
  }, []);

  const changePin = useCallback((oldPin: string, newPin: string): { success: boolean; message: string } => {
    if (oldPin.trim() !== adminPin) {
      return { success: false, message: 'Mã PIN hiện tại không chính xác!' };
    }
    const cleanNew = newPin.trim();
    if (cleanNew.length < 4 || cleanNew.length > 8 || !/^\d+$/.test(cleanNew)) {
      return { success: false, message: 'Mã PIN mới phải từ 4 đến 8 chữ số!' };
    }

    setAdminPin(cleanNew);
    try {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, cleanNew);
    } catch {}

    return { success: true, message: 'Đã đổi mã PIN Admin thành công!' };
  }, [adminPin]);

  const resetPinToDefault = useCallback(() => {
    setAdminPin(DEFAULT_ADMIN_PIN);
    try {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, DEFAULT_ADMIN_PIN);
    } catch {}
  }, []);

  const openAdminModal = useCallback((callback?: () => void) => {
    if (isAdmin) {
      // Already unlocked, execute directly
      if (callback) callback();
      return;
    }
    setOnSuccessCallback(callback ? () => callback : null);
    setIsAdminModalOpen(true);
  }, [isAdmin]);

  const closeAdminModal = useCallback(() => {
    setIsAdminModalOpen(false);
    setOnSuccessCallback(null);
  }, []);

  const hasCustomPin = useMemo(() => adminPin !== DEFAULT_ADMIN_PIN, [adminPin]);

  const value = useMemo(
    () => ({
      isAdmin,
      adminPin,
      hasCustomPin,
      verifyPin,
      loginAdmin,
      logoutAdmin,
      changePin,
      resetPinToDefault,
      isAdminModalOpen,
      openAdminModal,
      closeAdminModal,
      onSuccessCallback,
    }),
    [
      isAdmin,
      adminPin,
      hasCustomPin,
      verifyPin,
      loginAdmin,
      logoutAdmin,
      changePin,
      resetPinToDefault,
      isAdminModalOpen,
      openAdminModal,
      closeAdminModal,
      onSuccessCallback,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    return {
      isAdmin: false,
      adminPin: DEFAULT_ADMIN_PIN,
      hasCustomPin: false,
      verifyPin: () => false,
      loginAdmin: () => false,
      logoutAdmin: () => {},
      changePin: () => ({ success: false, message: 'No context' }),
      resetPinToDefault: () => {},
      isAdminModalOpen: false,
      openAdminModal: () => {},
      closeAdminModal: () => {},
      onSuccessCallback: null,
    };
  }
  return ctx;
}
