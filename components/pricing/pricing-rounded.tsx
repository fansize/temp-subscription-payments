'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card-header';
import type { Tables } from '@/types/db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { Moon } from 'lucide-react';
import pricingPlans from '@/config/pricing';
import { dummyPricing } from '@/config/pricing';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function PricingRounded({
  user,
  products,
  subscription
}: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  const displayProducts = products.length ? products : dummyPricing;

  if (!displayProducts.length) {
    return (
      <section className="container mx-auto" id="pricing">
        <p>no data</p>
      </section>
    );
  } else {
    return (
      <section className="container mx-auto" id="pricing">
        <div className="flex flex-col items-center justify-center w-full py-8 min-h-screen">
          <h2 className="text-3xl font-bold text-center">
            Flat pricing, no management fees.
          </h2>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <Button
              className="rounded-3xl"
              variant={billingInterval === 'month' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('month')}
            >
              Monthly
            </Button>
            <Button
              className="rounded-3xl"
              variant={billingInterval === 'year' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('year')}
            >
              Yearly
            </Button>
          </div>
          <div className="grid gap-6 mt-10 md:grid-cols-3">
            {displayProducts.map((product) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval
              );
              if (!price) return null;
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 100);
              const isActive = subscription
                ? product.name === subscription?.prices?.products?.name
                : false;
              const cardBgColor = isActive
                ? 'border-black bg-white text-black'
                : 'bg-white text-black';

              // Use features from the pricingPlans config
              const plan = pricingPlans.find(
                (plan) => plan.name === product.name
              );
              const features = plan ? plan.features : [];

              return (
                <Card
                  key={product.id}
                  className={`w-full max-w-sm rounded-3xl border-2 ${cardBgColor}`}
                >
                  <CardHeader className="rounded-t-3xl flex flex-col justify-center">
                    <div className="flex items-center">
                      <Moon className="h-8 w-8 text-gray-600 fill-zinc-500" />
                      <CardTitle className="ml-2 text-2xl font-bold">
                        {product.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold py-8">{priceString}</div>
                    <p className="mt-2 text-muted-foreground">
                      {product.description}
                    </p>
                    <Button
                      variant="default"
                      type="button"
                      onClick={() => handleStripeCheckout(price)}
                      className="mt-4 w-full rounded-3xl"
                    >
                      {subscription ? 'Manage' : 'Subscribe'}
                    </Button>
                    <ul className="mt-4 space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckIcon className="text-blue-500" />
                          <span>{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

