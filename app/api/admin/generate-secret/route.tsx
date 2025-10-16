import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';

export async function GET() {
  // Check if user is authenticated and is an admin
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Generate a 64-character hex string (32 bytes)
  const secret = crypto.randomBytes(32).toString('hex');
  
  return NextResponse.json({
    secret,
    instructions: 'Add this to your .env file as NEXTAUTH_SECRET'
  });
}