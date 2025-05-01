'use client'

import { useEffect, useState, ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    // This helps prevent hydration mismatch issues with Zustand's persist middleware
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated ? <>{children}</> : null;
}