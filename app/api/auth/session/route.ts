import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // No rate limiting in development
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json(session);
}
