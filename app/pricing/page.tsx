"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { loadStripe, Stripe } from '@stripe/stripe-js';

const plans = [
  {
    name: "Standard",
    price: `$${process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_PRICE || '10'}`,
    features: [
      `${process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_HEADSHOTS || '5'} AI-generated headshots per month`,
      "Basic editing tools",
      "Email support",
      "720p resolution images"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_ID
  },
  {
    name: "Pro",
    price: `$${process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE || '20'}`,
    features: [
      `${process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_HEADSHOTS || '15'} AI-generated headshots per month`,
      "Advanced editing tools",
      "Priority email support",
      "1080p resolution images",
      "Custom backgrounds"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_ID
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    console.log('Stripe Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    console.log('Standard Plan ID:', process.env.NEXT_PUBLIC_STRIPE_STANDARD_PLAN_ID);
    console.log('Pro Plan ID:', process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_ID);

    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
    } else {
      console.error('Stripe publishable key is missing');
      setError("Stripe configuration is missing. Please check your environment variables.");
    }
  }, []);

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      setError("Please sign in to subscribe");
      return;
    }

    if (!stripePromise) {
      setError("Stripe is not properly configured");
      return;
    }

    setIsLoading(priceId);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }

    setIsLoading(null);
  };

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Error</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <h2 className="text-2xl font-bold">{plan.name}</h2>
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
                disabled={isLoading === plan.priceId || !plan.priceId || !stripePromise}
              >
                {isLoading === plan.priceId ? "Processing..." : `Subscribe to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
