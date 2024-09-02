import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
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

    console.log('Sending request to Replicate with input:', JSON.stringify(input));

    const output = await replicate.run(
      "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      { input }
    );

    console.log('Received output from Replicate:', JSON.stringify(output));

    if (Array.isArray(output) && output.length > 0) {
      return NextResponse.json({ generatedImageUrl: output[0] });
    } else {
      throw new Error('No output generated from Replicate API');
    }
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'Failed to generate image', details: error.message }, { status: 500 });
  }
}
