'use client';

import AuthLayout from '@/components/AuthLayout';
import DeleteChat from '@/components/DeleteChat';
import { LoadingScreen } from '@/components/ui/LoaderScreen';
import { cn, formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Delete, ScanEye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  focusMode: string;
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      const res = await fetch(`/api/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  return (
    <AuthLayout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div>
          <div className="flex flex-col pt-4">
            <div className="flex items-center">
              <BookOpenText />
              <h1 className="text-3xl font-medium p-2">Library</h1>
            </div>
            <hr className="border-t border-[#2B2C2C] my-4 w-full" />
          </div>
          {chats.length === 0 && (
            <div className="flex flex-row items-center justify-center min-h-screen">
              <p className="text-black/70 dark:text-white/70 text-sm">
                No chats found.
              </p>
            </div>
          )}
          {chats.length > 0 && (
            <div className="flex flex-col pb-20 lg:pb-2">
              {chats.map((chat, i) => (
                <div
                  className={cn(
                    'flex flex-col space-y-4 py-6',
                    i !== chats.length - 1
                      ? 'border-b border-white-200 dark:border-dark-200'
                      : '',
                  )}
                  key={i}
                >
                  <Link
                    href={`/c/${chat.id}`}
                    className="text-black dark:text-white lg:text-xl font-medium truncate transition duration-200 hover:text-[#24A0ED] dark:hover:text-[#24A0ED] cursor-pointer"
                  >
                    {chat.title}
                  </Link>
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center space-x-1 lg:space-x-1.5 text-black/70 dark:text-white/70">
                      <ClockIcon size={15} />
                      <p className="text-xs">
                        {formatTimeDifference(new Date(), chat.createdAt)} Ago
                      </p>
                    </div>
                    <DeleteChat
                      chatId={chat.id}
                      chats={chats}
                      setChats={setChats}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
};

export default Page;
