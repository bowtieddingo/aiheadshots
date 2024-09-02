// app/api/generations/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import dbConnect from '@/lib/dbConnect';
import Generation from '@/models/Generation';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const generations = await Generation.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(generations);
  } catch (error) {
    console.error('Error fetching generations:', error);
    return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500 });
  }
}
