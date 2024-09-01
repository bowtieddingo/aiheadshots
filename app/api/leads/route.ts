import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead from '@/models/Lead';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email } = body;

    const lead = await Lead.create({ name, email });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error creating lead' }, { status: 400 });
  }
}
