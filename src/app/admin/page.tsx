'use client';

import React from 'react';
import UnconfirmedUsersTable from '@/components/UnconfirmedUsersTable';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/ui/AccessDenied';

const AdminPage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <UnconfirmedUsersTable />
    </div>
  );
};

export default AdminPage;