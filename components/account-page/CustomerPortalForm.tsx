'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/utils/types_db';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
  | (Price & {
    products: Product | null;
  })
  | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>您的计划</CardTitle>
        <CardDescription>
          {subscription
            ? `您当前使用的是 ${subscription?.prices?.products?.name} 计划。`
            : '您目前没有订阅任何计划。'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-8 mb-4 text-xl font-semibold">
          {subscription ? (
            `${subscriptionPrice}/${subscription?.prices?.interval}`
          ) : (
            <Link href="/">选择您的计划</Link>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
          <p className="pb-4 sm:pb-0">在Stripe上管理您的订阅。</p>
          <Button
            variant="outline"
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
          >
            打开客户门户
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
