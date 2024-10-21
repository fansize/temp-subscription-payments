import { Metadata } from 'next';
import Footer from '@/components/main-ui/footer';
import { marketingConfig } from '@/config/marketing';
import CircularNavigation from '@/components/main-ui/navigation';
import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import { ThemeProvider } from '@/components/main-ui/theme-provider';
import 'styles/globals.css';

import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const title = 'Next.js Subscription Starter';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const user = await getUser(supabase);

  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CircularNavigation
            items={marketingConfig.mainNav}
            user={user ? true : false}
          />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Suspense>
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
