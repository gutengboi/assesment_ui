'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthChecker({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Public routes that don't require authentication
        const publicRoutes = ['/login', '/register', '/'];

        if (!isAuthenticated && !publicRoutes.includes(pathname)) {
            router.push('/login');
        } else if (isAuthenticated && pathname === '/login') {
            router.push('/dashboard');
        }
    }, [isAuthenticated, pathname, router]);

    return <>{children}</>;
}
