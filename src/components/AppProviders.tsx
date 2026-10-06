'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { AdminProvider } from '@/context/AdminContext';
import { ProfileModal } from '@/components/ProfileModal';
import { AdminGateModal } from '@/components/AdminGateModal';
import { AuthModal } from '@/components/AuthModal';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <ProfileProvider>
          {children}
          <ProfileModal />
          <AdminGateModal />
          <AuthModal />
        </ProfileProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

