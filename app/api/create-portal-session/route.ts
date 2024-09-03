// app/api/create-portal-session/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  try {
    // Retrieve the Stripe customer ID from your database
    const stripeCustomerId = await getStripeCustomerId(session.user.id);

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'No associated Stripe customer found.' }, { status: 400 });
    }

    // Create a Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    // Return the URL of the portal session
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json({ error: 'Failed to create portal session.', details: error.message }, { status: 500 });
  }
}

// This function should be implemented to fetch the Stripe customer ID from your database
async function getStripeCustomerId(userId: string): Promise<string | null> {
  // TODO: Implement this function to retrieve the Stripe customer ID from your database
  console.log('Fetching Stripe customer ID for user:', userId);
  // For now, return null to simulate no customer found
  return null;
}
