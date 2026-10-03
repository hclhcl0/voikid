'use client';

import React from 'react';
import { ProfileProvider } from '@/context/ProfileContext';
import { AdminProvider } from '@/context/AdminContext';
import { ProfileModal } from '@/components/ProfileModal';
import { AdminGateModal } from '@/components/AdminGateModal';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ProfileProvider>
        {children}
        <ProfileModal />
        <AdminGateModal />
      </ProfileProvider>
    </AdminProvider>
  );
}
