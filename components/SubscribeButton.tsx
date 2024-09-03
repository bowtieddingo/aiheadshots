import React from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscribeButton({ priceId }: { priceId: string }) {
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      alert('Please sign in to subscribe');
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ price: priceId }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleSubscribe} className="bg-blue-500 text-white px-4 py-2 rounded">
      Subscribe
    </button>
  );
}
