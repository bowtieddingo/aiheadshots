import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Error verifying webhook signature:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      await dbConnect();

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionChange(event);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeletion(event);
          break;
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionChange(event: any) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  console.log('Processing subscription change for customer:', customerId);

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    throw new Error('User not found');
  }

  const priceId = subscription.items.data[0].price.id;
  const isActive = subscription.status === 'active';

  console.log('Updating user:', user.id, 'with plan:', priceId, 'status:', isActive);

  // Assign tokens based on the plan
  let tokensToAssign = 0;
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_ID) {
    tokensToAssign = Number(process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_HEADSHOTS) || 5;
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_ID) {
    tokensToAssign = Number(process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_HEADSHOTS) || 15;
  }

  user.isSubscriptionActive = isActive;
  user.stripePlanId = priceId;
  user.tokens = isActive ? tokensToAssign : 0;

  await user.save();
  console.log('User updated successfully');
}

async function handleSubscriptionDeletion(event: any) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  console.log('Processing subscription deletion for customer:', customerId);

  const user = await User.findOne({ stripeCustomerId: customerId });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    throw new Error('User not found');
  }

  user.isSubscriptionActive = false;
  user.stripePlanId = null;
  user.tokens = 0;

  await user.save();
  console.log('User subscription deleted successfully');
}
