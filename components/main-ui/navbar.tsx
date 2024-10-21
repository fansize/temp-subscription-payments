'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { MainNavItem } from 'types';
import { Icons } from '@/components/icons/icons';
import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/main-ui/mode-toggle';
import { SunIcon } from 'lucide-react';

interface NavbarProps {
  title?: string;
  logo?: React.ReactNode;
  items?: MainNavItem[];
  user?: boolean;
}

export default function NavBar({
  items,
  user,
  logo,
  title,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <nav className="flex flex-wrap items-center justify-between w-full md:w-fit p-2 md:p-1 gap-4 md:gap-20 md:bg-zinc-50 md:dark:bg-zinc-900 md:rounded-full md:px-8 md:border-2 md:border-muted/30 md:dark:border-muted/80 md:shadow mx-auto mt-6 mb-2 backdrop-blur-sm md:backdrop-blur-none">
      <div className="flex items-center space-x-2">
        <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded-full">
          {logo || <SunIcon className="size-8 transition-transform duration-300 ease-in-out hover:scale-110" />}
        </div>
        <span className="text-lg md:text-xl font-extrabold tracking-tightest">
          {title}
        </span>
      </div>
      {items?.length ? (
        <div className="hidden md:flex space-x-8">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'text-primary transition-colors hover:text-foreground/80',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <div className="hidden md:block">
          <ModeToggle />
        </div>
        <Link
          href={user ? '/account' : '/signin'}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'rounded-full p-2 md:p-5 text-xs md:text-sm hidden md:inline-flex'
          )}
        >
          {user ? 'Account' : 'Login'}
        </Link>
        <button
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.Menu />}
          <span className="sr-only">Menu</span>
        </button>
      </div>
    </nav>
  );
}
