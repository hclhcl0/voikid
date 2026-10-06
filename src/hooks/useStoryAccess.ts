'use client';
import {useAuth} from '@/context/AuthContext';
import {useBackendSession} from './useBackendSession';
export function useStoryAccess() {
  const auth=useAuth(),admin=useBackendSession();
  return {loading:auth.isLoading||admin.loading,canManage:admin.authenticated||auth.account?.role==='parent'};
}
