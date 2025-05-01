
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api-assessment.onrender.com';

export async function GET(req: NextRequest) {
    const token = req.headers.get('x-token');

    try {
        const res = await fetch(`${API_BASE}/departments`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        const json = await res.json();
        const departments = json.departments ?? json; // fallback if already an array

        if (!Array.isArray(departments)) {
            return NextResponse.json({ error: 'Expected array from backend' }, { status: 500 });
        }

        return NextResponse.json(departments);// return raw array
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('x-token'); // updated here
    const body = await req.json();

    try {
        const res = await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
    }
}