'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip check on login page
    if (pathname === '/login') return;

    // Check if the current browser tab has an active session token
    const isTabActive = sessionStorage.getItem('cimcim_tab_active');
    if (!isTabActive) {
      // The tab was closed or opened in a new session without authentication
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        router.push('/login');
      });
    }
  }, [pathname, router]);

  return <>{children}</>;
}
