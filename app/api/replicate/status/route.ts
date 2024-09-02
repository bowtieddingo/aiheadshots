// app/api/replicate/status/route.ts
import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { getServerSession } from "next-auth/next";
import dbConnect from '@/lib/dbConnect';
import Generation from '@/models/Generation';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const predictionId = searchParams.get('id');
  const originalImageUrl = searchParams.get('originalImageUrl');
  const gender = searchParams.get('gender');

  if (!predictionId || !originalImageUrl || !gender) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === 'succeeded') {
      const generatedImageUrl = prediction.output[0];

      // Save to MongoDB
      await dbConnect();
      await Generation.create({
        userId: session.user.id,
        originalImageUrl,
        generatedImageUrl,
        gender,
      });

      return NextResponse.json({ status: 'complete', output: generatedImageUrl });
    } else if (prediction.status === 'failed') {
      return NextResponse.json({ status: 'failed', error: prediction.error });
    } else {
      return NextResponse.json({ status: 'processing' });
    }
  } catch (error) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json({ error: 'Failed to check prediction status' }, { status: 500 });
  }
}
