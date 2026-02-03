import { NextRequest, NextResponse } from 'next/server';

interface RegisterRequest {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: 'google' | 'github';
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequest = await req.json();

    const { uid, email, displayName, photoURL, provider } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save user to database
    // For now, we'll just return success
    console.log(`[Auth] User registered: ${uid} (${provider})`);

    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        displayName,
        photoURL,
        provider,
        credits: 150, // Initial credits for new users
        isPro: false,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Auth Register Error]:', error.message);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}
