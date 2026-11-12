import "server-only";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { rateLimit } from "./security";
export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "teachvero-local-only-do-not-deploy-this-secret"
      : undefined),
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = String(req.headers?.["x-forwarded-for"] || "local").split(
          ",",
        )[0];
        if (!rateLimit("login:" + ip, 30)) return null;
        if (
          !credentials?.email ||
          !credentials.password ||
          credentials.password.length > 200
        )
          return null;
        const email = credentials.email.trim().toLowerCase();
        if (
          process.env.NODE_ENV === "production" &&
          email.endsWith("@teachvero.local")
        )
          return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !verifyPassword(credentials.password, user.passwordHash))
          return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
};
export async function currentUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.email
    ? prisma.user.findUnique({ where: { email: session.user.email } })
    : null;
}
