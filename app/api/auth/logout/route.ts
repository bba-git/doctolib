import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    
    // Call your backend API
    const response = await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Failed to logout' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while logging out' },
      { status: 500 }
    );
  }
} 