import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (!sessionId) {
    console.error('Missing session_id in success route');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=missing_session_id`);
  }

  try {
    await dbConnect();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved Stripe session:', sessionId);

    const userId = session.client_reference_id;
    if (!userId) {
      console.error('No client_reference_id found on session:', sessionId);
      throw new Error('No client_reference_id found on session');
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('No user found for ID:', userId);
      throw new Error('No user found');
    }

    // Retrieve the product details to determine the plan
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id;
    console.log('Subscription price ID:', priceId);

    // Assign tokens based on the plan
    let tokensToAssign = 0;
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_ID) {
      tokensToAssign = Number(process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_HEADSHOTS) || 5;
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_ID) {
      tokensToAssign = Number(process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_HEADSHOTS) || 15;
    } else {
      console.warn('Unknown price ID:', priceId);
    }

    console.log('Assigning tokens:', tokensToAssign);

    // Update user subscription status and tokens
    user.isSubscriptionActive = true;
    user.stripePlanId = priceId;
    user.stripeSubscriptionId = session.subscription as string;
    user.stripeCustomerId = session.customer as string;
    user.tokens = tokensToAssign;

    await user.save();
    console.log('User updated successfully:', userId);

    // Redirect to dashboard with success message
    return NextResponse.redirect(`${baseUrl}/dashboard?success=subscription_active`);
  } catch (error) {
    console.error('Error processing successful subscription:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=subscription_error`);
  }
}
