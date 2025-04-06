import ChatWindow from '@/components/ChatWindow';
import AccessDenied from '@/components/ui/AccessDenied';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role === 'not_confirmed') {
    return <AccessDenied />;
  }

  const { chatId } = await params;
  return <ChatWindow id={chatId} />;
};

export default Page;
