'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/ui/LoaderScreen';
import AuthLayout from '@/components/AuthLayout';

interface Discover {
  title: string;
  content: string;
  url: string;
  thumbnail: string;
}

const Page = () => {
  const [discover, setDiscover] = useState<Discover[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/discover`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        data.blogs = data.blogs.filter((blog: Discover) => blog.thumbnail);

        setDiscover(data.blogs);
      } catch (err: any) {
        console.error('Error fetching data:', err.message);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthLayout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div>
            <div className="flex flex-col pt-4">
              <div className="flex items-center">
                <Search />
                <h1 className="text-3xl font-medium p-2">Discover</h1>
              </div>
              <hr className="border-t border-[#2B2C2C] my-4 w-full" />
            </div>

            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pb-28 lg:pb-8 w-full justify-items-center lg:justify-items-start">
              {discover &&
                discover?.map((item, i) => (
                  <Link
                    href={`/?q=Summary: ${item.url}`}
                    key={i}
                    className="max-w-sm rounded-lg overflow-hidden bg-light-secondary dark:bg-dark-secondary hover:-translate-y-[1px] transition duration-200"
                    target="_blank"
                  >
                    <img
                      className="object-cover w-full aspect-video"
                      src={
                        new URL(item.thumbnail).origin +
                        new URL(item.thumbnail).pathname +
                        `?id=${new URL(item.thumbnail).searchParams.get('id')}`
                      }
                      alt={item.title}
                    />
                    <div className="px-6 py-4">
                      <div className="font-bold text-lg mb-2">
                        {item.title.slice(0, 100)}...
                      </div>
                      <p className="text-black-70 dark:text-white/70 text-sm">
                        {item.content.slice(0, 100)}...
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default Page;
