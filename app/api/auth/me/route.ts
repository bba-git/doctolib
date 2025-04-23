import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    
    // Call your backend API
    const response = await fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Failed to get user info' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while getting user info' },
      { status: 500 }
    );
  }
} 