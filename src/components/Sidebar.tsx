'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Search, SquarePen, Settings, LogOutIcon, LogIn, Milestone } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { type ReactNode } from 'react';
import Layout from './Layout';
import { useSession } from 'next-auth/react';
import { AuthContainers } from './AuthContainers';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();


  const segments = useSelectedLayoutSegments();

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Home',
    },
    {
      icon: Search,
      href: '/discover',
      active: segments.includes('discover'),
      label: 'Discover',
    },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary px-2 py-4">
          <a href="/">
            <SquarePen className="cursor-pointer" />
          </a>
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-row items-center justify-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-150 transition w-full py-2 rounded-lg',
                  link.active
                    ? 'text-black dark:text-white'
                    : 'text-black/70 dark:text-white/70',
                )}
              >
                <link.icon />
                {link.active && (
                  <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white" />
                )}
              </Link>
            ))}
          </VerticalIconContainer>
            <div className='flex flex-col items-center space-y-2'>
              <Link href="/settings" className='relative flex flex-col items-center space-y-1 text-center p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 w-full'>
                <Settings className="cursor-pointer w-full" />
              </Link>
              {session.data?.user?.role === 'admin' && (
                <Link href="/admin" className='relative flex flex-col items-center space-y-1 text-center p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 w-full'>
                  <Milestone className="cursor-pointer w-full" />
                </Link>
              )}
              <AuthContainers sessionStatus={session.status} />
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center justify-around gap-x-2 bg-light-primary dark:bg-dark-primary px-4 py-3 shadow-sm lg:hidden">
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-black dark:text-white'
                : 'text-black dark:text-white/70',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
