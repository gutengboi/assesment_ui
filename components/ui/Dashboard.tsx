'use client';

import { useEffect, useState, JSX, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface Department {
    id: string;
    name: string;
    subDepartments?: Department[];
}

export default function DashboardContent(): JSX.Element {
    const { isAuthenticated, logout, token } = useAuthStore();
    const router = useRouter();

    const [departments, setDepartments] = useState<Department[]>([]);
    const [name, setName] = useState('');
    const [subNames, setSubNames] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push('/login');
        } else {
            fetchDepartments();
        }
    }, [isAuthenticated, token, router]);

    const handleAuthError = () => {
        setSessionExpired(true);
        setError('Your session has expired. Please log in again.');
        logout(); 
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    };

    const fetchDepartments = async () => {
        if (!token) return;

        setLoading(true);
        try {
            console.log('Fetching departments with token');

            const res = await fetch('/api/departments', {
                headers: {
                    'x-token': token,
                },
            });

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Department fetch error:', errorData);
                throw new Error(errorData.error || 'Error loading departments');
            }

            const data = await res.json();
            console.log('Fetched departments response:', data);

            if (!data.departments || !Array.isArray(data.departments)) {
                throw new Error('Invalid data format: expected an array of departments');
            }

            setDepartments(data.departments);
        } catch (err: any) {
            console.error('Fetch departments error:', err);
            setError(err.message || 'Error loading departments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Authentication token missing. Please log in again.');
            return;
        }

        if (sessionExpired) {
            setError('Your session has expired. Please log in again.');
            return;
        }

        setLoading(true);
        setError('');

        const subDepartments = subNames
            .filter(name => name.trim())
            .map(name => ({ name: name.trim() }));

        try {
            console.log('Creating department with data:', { name, subDepartments });

            const res = await fetch('/api/departments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                body: JSON.stringify({
                    name,
                    subDepartments,
                }),
            });

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                console.error('Department creation error response:', data);
                throw new Error(data.error || data.message || 'Failed to create department');
            }

            console.log('Department created successfully:', data);
            await fetchDepartments();
            setName('');
            setSubNames(['']);
        } catch (err: any) {
            console.error('Department creation error:', err);
            setError(err.message || 'Failed to create department');
        } finally {
            setLoading(false);
        }
    };

    const renderDepartment = (dept: Department, level = 0) => (
        <li key={dept.id} className="ml-4">
            <span className="font-semibold">{'—'.repeat(level)} {dept.name}</span>
            {Array.isArray(dept.subDepartments) && dept.subDepartments.length > 0 && (
                <ul>
                    {dept.subDepartments.map((sub) => renderDepartment(sub, level + 1))}
                </ul>
            )}
        </li>
    );

    if (sessionExpired) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Session Expired</h2>
                    <p className="mb-4">Your login session has expired. Redirecting to login page...</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-indigo-600">My App</h1>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="py-10 px-4 max-w-4xl mx-auto space-y-8">
                <section>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                    <p className="text-gray-600">Manage departments and view hierarchy</p>
                </section>

                <section className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Create Department</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Department Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sub-departments</label>
                            {subNames.map((sub, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Sub-department ${index + 1}`}
                                    value={sub}
                                    onChange={(e) => {
                                        const newSubs = [...subNames];
                                        newSubs[index] = e.target.value;
                                        setSubNames(newSubs);
                                    }}
                                    className="w-full p-2 border rounded mt-1"
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setSubNames([...subNames, ''])}
                                className="mt-2 text-indigo-600 text-sm"
                            >
                                + Add another
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Create Department'}
                        </button>
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    </form>
                </section>

                <section className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Department Hierarchy</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : departments.length > 0 ? (
                        <ul className="list-disc ml-4">
                            {departments.map((dept) => renderDepartment(dept))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No departments found. Create one above!</p>
                    )}
                </section>
            </main>
        </div>
    );
}