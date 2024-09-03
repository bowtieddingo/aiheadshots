import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

async function createCheckoutSession(priceId: string, userId: string, userEmail: string) {
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId: userId,
    },
  });

  return checkoutSession;
}

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

  const { priceId } = await req.json();

  try {
    const checkoutSession = await createCheckoutSession(priceId, user.id, user.email);
    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.redirect('/api/auth/signin');
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.redirect('/dashboard?error=user_not_found');
  }

  const { searchParams } = new URL(req.url);
  const priceId = searchParams.get('priceId');

  if (!priceId) {
    return NextResponse.redirect('/dashboard?error=missing_price_id');
  }

  try {
    const checkoutSession = await createCheckoutSession(priceId, user.id, user.email);
    return NextResponse.redirect(checkoutSession.url!);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.redirect('/dashboard?error=checkout_creation_failed');
  }
}
