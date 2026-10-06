'use client';
import { useEffect, useState } from 'react';

export function useBackendSession() {
  const [session, setSession] = useState({ authenticated: false, loading: true });
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!controller.signal.aborted) setSession({ authenticated: response.ok && data.authenticated === true, loading: false });
      } catch {
        if (!controller.signal.aborted) setSession({ authenticated: false, loading: false });
      }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('vocakids:admin-session-changed', refresh);
    return () => { controller.abort(); window.removeEventListener('focus', refresh); window.removeEventListener('vocakids:admin-session-changed', refresh); };
  }, []);
  return session;
}
