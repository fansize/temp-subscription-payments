import 'styles/globals.css';
import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';

import NavBar from '@/components/main-ui/navbar';
import Footer from '@/components/main-ui/footer';


import { ThemeProvider } from '@/components/main-ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren, Suspense } from 'react';

import { navbarConfig } from '@/config/navbar';
import { siteConfig } from '@/config/site';

import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';



export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const user = await getUser(supabase);

  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <main className="min-h-screen">
            {children}
          </main>

          <Suspense>
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
