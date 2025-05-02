import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api-assessment.onrender.com';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log('Login attempt for email:', email);

        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

  
        console.log('API login response status:', response.status);
     
        if (data.accessToken) {
            console.log('Token received format:', {
                tokenStart: data.accessToken.substring(0, 10) + '...',
                tokenLength: data.accessToken.length,

                hasBearerPrefix: data.accessToken.startsWith('Bearer ')
            });
        } else {
            console.log('No token received in response:', data);
        }

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Login failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}