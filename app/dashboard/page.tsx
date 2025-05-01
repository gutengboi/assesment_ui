
import DashboardContent from '@/components/ui/Dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | My App',
    description: 'Your account dashboard',
};

export default function DashboardPage() {
    return <DashboardContent />;
}