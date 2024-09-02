// app/api/replicate/status/route.ts

import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const predictionId = searchParams.get('id');

  if (!predictionId) {
    return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === 'succeeded') {
      return NextResponse.json({ status: 'complete', output: prediction.output });
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
