// app/api/replicate/route.ts
import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database and get the user
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user has an active subscription and available tokens
    if (!user.isSubscriptionActive) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 });
    }

    if (user.tokens <= 0) {
      return NextResponse.json({ error: 'No tokens available. Please upgrade your plan.' }, { status: 403 });
    }

    // Proceed with the Replicate API call
    const { uploadedImageUrl, gender } = await req.json();
    console.log('Received uploadedImageUrl:', uploadedImageUrl);
    console.log('Received gender:', gender);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prompt = gender === 'male' 
      ? "A professional business headshot photo of a man 4k img"
      : "A professional headshot photo of a woman 4k img";

    const input = {
      prompt,
      num_steps: 50,
      input_image: uploadedImageUrl
    };

    console.log('Starting prediction with Replicate');
    const prediction = await replicate.predictions.create({
      version: "ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      input: input,
    });

    // Deduct a token from the user
    user.tokens -= 1;
    await user.save();

    return NextResponse.json({ predictionId: prediction.id, remainingTokens: user.tokens });
  } catch (error) {
    console.error('Detailed error:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: 'Failed to start image generation', details: errorMessage },
      { status: 500 }
    );
  }
}
