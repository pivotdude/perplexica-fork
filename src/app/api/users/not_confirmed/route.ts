import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { users, roles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const notConfirmedRole = await db.select().from(roles).where(eq(roles.name, 'not_confirmed')).then((res) => res[0]);
    if (!notConfirmedRole) {
      return NextResponse.json({ error: 'Role not_confirmed not found' }, { status: 404 });
    }

    const notConfirmedUsers = await db.select().from(users).where(eq(users.roleId, notConfirmedRole.id));
    return NextResponse.json(notConfirmedUsers);
  } catch (error) {
    console.error('Error fetching not confirmed users:', error);
    return NextResponse.json({ error: 'Failed to fetch not confirmed users' }, { status: 500 });
  }
}