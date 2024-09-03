import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const plans = [
  {
    name: "Standard",
    price: `$${process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_PRICE}`,
    features: [
      `${process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_HEADSHOTS} AI-generated headshots per month`,
      "Basic editing tools",
      "Email support",
      "720p resolution images"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_ID
  },
  {
    name: "Pro",
    price: `$${process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE}`,
    features: [
      `${process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_HEADSHOTS} AI-generated headshots per month`,
      "Advanced editing tools",
      "Priority email support",
      "1080p resolution images",
      "Custom backgrounds"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_ID
  }
];

const Pricing: React.FC = () => {
  const { data: session } = useSession();

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      // If not signed in, start the sign-in process
      signIn(undefined, { callbackUrl: `/api/create-checkout-session?priceId=${priceId}` });
    } else {
      // If signed in, redirect to checkout
      await startCheckout(priceId);
    }
  };

  const startCheckout = async (priceId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-10" id="pricing">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-4xl font-bold">{plan.price}<span className="text-base font-normal">/month</span></p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan.priceId!)}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
