import * as Ably from 'ably';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
        headers : await headers(),
    });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Create a unique clientId based on the user's ID
    const clientId = session.user.id;
    
    // Initialize the Ably SDK with your API key
    const client = new Ably.Rest(process.env.ABLY_API_KEY!);
    
    // Create a token request with the client ID
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: clientId,
    });
    
    // Return the token request data to the client
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error('Error creating Ably token:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}