import { NextResponse } from "next/server";
import db from "@/lib/db";
import { users, roles } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await db.select({ count: sql`count(*)` }).from(users).then((res) => res[0].count);

    const roleName = userCount === 0 ? 'admin' : 'not_confirmed';
    const role = await db.select().from(roles).where(eq(roles.name, roleName)).then((res) => res[0]);

    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      name,
      emailVerified: null,
      image: null,
      roleId: role.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}