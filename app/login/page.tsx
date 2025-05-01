

import LoginForm from '@/components/ui/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | My App',
    description: 'Login to access your account',
};

export default function LoginPage() {
    return <LoginForm />;
}
