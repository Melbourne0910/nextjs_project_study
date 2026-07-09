import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import db from "@/lib/db-setup";

export const runtime = "nodejs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim() || "";
        const password = credentials?.password || "";

        if (!email || !password) {
          return null;
        }

        const user = db
          .prepare(`
            SELECT id, name, email, password, email_verified, is_admin
            FROM users
            WHERE email = ?
          `)
          .get(email);

        if (!user || !user.email_verified) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = db
          .prepare("SELECT id, is_admin FROM users WHERE email = ?")
          .get(user.email);

        if (dbUser) {
          token.id = dbUser.id;
          token.isAdmin = Boolean(dbUser.is_admin);
        } else {
          token.isAdmin = false;
        }
      } else if (token?.email) {
        const dbUser = db
          .prepare("SELECT id, is_admin FROM users WHERE email = ?")
          .get(token.email);

        if (dbUser) {
          token.id = dbUser.id;
          token.isAdmin = Boolean(dbUser.is_admin);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }

      if (token?.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/chat`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
