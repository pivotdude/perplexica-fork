import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { accounts, sessions, users, verificationTokens, roles } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";
import db from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  // @ts-ignore
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('Auth attempt with credentials:', credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .then((res) => res[0]);

          if (!user || !user.password) {
            console.log('User not found or no password stored');
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password as string);
          if (!isValid) {
            console.log('Invalid password');
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        const user = await db.select().from(users).where(eq(users.id, token.id as string)).then((res) => res[0]);
        if (user) {
          const role = await db.select().from(roles).where(eq(roles.id, user.roleId)).then((res) => res[0]);
          if (role) {
            session.user.role = role.name;
          }
        }
      }
      return session;
    },
  },
})