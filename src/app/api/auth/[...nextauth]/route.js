import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
    async signIn({ user, account }) {
      if (!["google", "github"].includes(account?.provider)) {
        return true;
      }

      try {
        const email = user.email?.trim();

        if (!email) {
          return false;
        }

        const existingUser = db
          .prepare("SELECT id FROM users WHERE email = ?")
          .get(email);

        if (!existingUser) {
          const name = user.name?.trim() || email.split("@")[0];

          db.prepare(`
            INSERT INTO users (
              name,
              email,
              password,
              email_verified,
              is_admin
            ) VALUES (?, ?, ?, ?, ?)
          `).run(name, email, "", 1, 0);
        }

        return true;
      } catch (error) {
        console.error("OAuth sign in error:", error);
        return false;
      }
    },

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
