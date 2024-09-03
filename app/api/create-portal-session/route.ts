// app/api/create-portal-session/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

function ensureHttps(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export async function POST() {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }
  
  try {
    // Fetch user from database
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 400 });
    }
    
    // Fetch the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    
    if (!subscription.customer) {
      return NextResponse.json({ error: 'No customer associated with the subscription.' }, { status: 400 });
    }
    
    // Ensure the customer is a string (it can be a string or a Stripe.Customer object)
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    
    // Ensure the return_url has a proper scheme
    const returnUrl = ensureHttps(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    
    // Create a Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    // Return the URL of the portal session
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create portal session.', details: errorMessage }, { status: 500 });
  }
}
