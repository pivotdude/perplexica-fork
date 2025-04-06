import {
  LogOutIcon,
  LogIn,
  Milestone,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Loader } from './ui/Loader';

export const AuthContainers = ({
  sessionStatus,
}: {
  sessionStatus: 'authenticated' | 'unauthenticated' | 'loading';
}) => {
  if (sessionStatus === 'loading') {
    return <Loader />;
  }

  return (
    <>
      {sessionStatus === 'authenticated' ? (
        <div>
          <Link
            href="/api/auth/signout"
            className="relative flex flex-col items-center space-y-1 text-center w-full p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <LogOutIcon className="" />
            <p className="text-xs">Logout</p>
          </Link>
        </div>
      ) : (
        <div>
          <Link
            href="/login"
            className="relative flex flex-col items-center space-y-1 text-center w-full p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <LogIn />
            <p className="text-xs">Login</p>
          </Link>
          <Link
            href="/register"
            className="relative flex flex-col items-center space-y-1 text-center w-full p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
          >
            <Milestone />
            <p className="text-xs">Register</p>
          </Link>
        </div>
      )}
    </>
  );
};
