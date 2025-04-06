import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { users, roles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const userRole = await db.select().from(users).where(eq(users.id, userId)).then((res) => res[0]);
    if (!userRole) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userRoleId = userRole.roleId;
    const userRoleData = await db.select().from(roles).where(eq(roles.id, userRoleId)).then((res) => res[0]);
    if (userRoleData.name === 'user') {
      return NextResponse.json({ message: 'User is already confirmed' }, { status: 200 });
    }

    const userRoleToUpdate = await db.select().from(roles).where(eq(roles.name, 'user')).then((res) => res[0]);
    if (!userRoleToUpdate) {
      return NextResponse.json({ error: 'Role "user" not found' }, { status: 404 });
    }

    await db.update(users).set({ roleId: userRoleToUpdate.id }).where(eq(users.id, userId));
    return NextResponse.json({ message: 'User confirmed successfully' });
  } catch (error) {
    console.error('Error confirming user:', error);
    return NextResponse.json({ error: 'Failed to confirm user' }, { status: 500 });
  }
}