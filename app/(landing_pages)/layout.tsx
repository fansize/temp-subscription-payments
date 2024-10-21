import { PropsWithChildren } from 'react';

import NavBar from '@/components/main-ui/navbar';
import Footer from '@/components/main-ui/footer';

import { navbarConfig } from '@/config/navbar';
import { siteConfig } from '@/config/site';

import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';


export default async function MainLayout({ children }: PropsWithChildren) {
    const supabase = createClient();
    const user = await getUser(supabase);

    console.log('Marketing user', user);

    return (
        <div className="flex min-h-screen flex-col items-center w-full">
            <NavBar
                title={siteConfig.name}
                items={navbarConfig.mainNav}
                user={user ? true : false}
            />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}