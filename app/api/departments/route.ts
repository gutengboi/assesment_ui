// app/api/departments/route.ts - Updated with token format tests
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api-assessment.onrender.com';

export async function GET(req: NextRequest) {
    const token = req.headers.get('x-token');

    if (!token) {
        console.error('No token provided in request');
        return NextResponse.json({ error: 'Authentication token is required', departments: [] }, { status: 401 });
    }

    console.log('GET departments - token received:', token.substring(0, 10) + '...');

    // We'll try multiple authorization header formats to identify the correct one
    const authFormats = [
        { name: 'Raw token', value: token },
        { name: 'Bearer with space', value: `Bearer ${token}` },
        { name: 'Bearer no space', value: `Bearer${token}` }
    ];

    let successResponse = null;

    // Try each format until we get a successful response
    for (const format of authFormats) {
        try {
            console.log(`Trying auth format: ${format.name}`);

            const res = await fetch(`${API_BASE}/departments`, {
                headers: {
                    Authorization: format.value
                },
            });

            console.log(`Response for ${format.name}: ${res.status}`);

            if (res.ok) {
                const data = await res.json();
                console.log('Successful format found:', format.name);
                successResponse = data;
                break;
            }
        } catch (error) {
            console.error(`Error with format ${format.name}:`, error);
        }
    }

    if (successResponse) {
        return NextResponse.json({
            departments: Array.isArray(successResponse) ? successResponse : (successResponse.departments || [])
        });
    }

    // If all formats failed, try one more thing - check if token itself already contains "Bearer"
    if (token.startsWith('Bearer ')) {
        try {
            // Token itself already has Bearer, so use it directly
            console.log('Token already contains Bearer prefix, using as is');
            const res = await fetch(`${API_BASE}/departments`, {
                headers: {
                    Authorization: token
                },
            });

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json({
                    departments: Array.isArray(data) ? data : (data.departments || [])
                });
            }
        } catch (error) {
            console.error('Error with direct token usage:', error);
        }
    }

    return NextResponse.json({
        error: 'API error: 401',
        message: 'Failed to authenticate with the API server, please try logging in again',
        departments: []
    }, { status: 401 });
}

export async function POST(req: NextRequest) {
    const token = req.headers.get('x-token');

    if (!token) {
        console.error('No token provided in POST request');
        return NextResponse.json({ error: 'Authentication token is required' }, { status: 401 });
    }

    console.log('POST departments - token received:', token.substring(0, 10) + '...');

    let body;
    try {
        body = await req.json();
        console.log('Received department creation request:', body);
    } catch (e) {
        console.error('Failed to parse request body:', e);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Similar to GET, try different authorization formats
    const authFormats = [
        { name: 'Raw token', value: token },
        { name: 'Bearer with space', value: `Bearer ${token}` },
        { name: 'Bearer no space', value: `Bearer${token}` }
    ];

    let successResponse = null;

    for (const format of authFormats) {
        try {
            console.log(`Trying auth format for POST: ${format.name}`);

            const res = await fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: format.value
                },
                body: JSON.stringify(body),
            });

            console.log(`POST Response for ${format.name}: ${res.status}`);

            const responseData = await res.json().catch(() => ({}));

            if (res.ok) {
                console.log('Successful POST format found:', format.name);
                successResponse = responseData;
                break;
            } else {
                console.error(`POST error with ${format.name}:`, responseData);
            }
        } catch (error) {
            console.error(`Error with POST format ${format.name}:`, error);
        }
    }

    if (successResponse) {
        return NextResponse.json(successResponse);
    }

    // If token itself has Bearer prefix
    if (token.startsWith('Bearer ')) {
        try {
            console.log('Token already contains Bearer prefix, using as is for POST');
            const res = await fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data);
            }

            const errorData = await res.json().catch(() => ({}));
            console.error('POST error with direct token:', errorData);
        } catch (error) {
            console.error('Error with direct token usage for POST:', error);
        }
    }

    return NextResponse.json({
        error: 'Failed to create department',
        message: 'Authentication failed with the API server, please try logging in again'
    }, { status: 401 });
}