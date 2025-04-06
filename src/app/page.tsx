import ChatWindow from '@/components/ChatWindow';
import { auth } from '@/lib/auth';
import AccessDenied from '@/components/ui/AccessDenied';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat - Perplexica',
  description: 'Chat with the internet, chat with Perplexica.',
};

const Home = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  if (session.user.role === 'not_confirmed') {
    return <AccessDenied />
  }

  return (
    <div>
      <Suspense>
        <ChatWindow />
      </Suspense>
    </div>
  );
};

export default Home;
