import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.isSubscriptionActive) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 403 });
  }

  if (user.tokens <= 0) {
    return NextResponse.json({ error: 'No tokens available' }, { status: 403 });
  }

  user.tokens -= 1;
  await user.save();

  return NextResponse.json({ tokens: user.tokens });
}
