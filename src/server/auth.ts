import "server-only";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { rateLimit, clientKey } from "./security";
const configuredSecret = process.env.NEXTAUTH_SECRET;
const productionSecret =
  configuredSecret &&
  configuredSecret.length >= 32 &&
  !configuredSecret.startsWith("teachvero-local")
    ? configuredSecret
    : undefined;
export const authOptions: NextAuthOptions = {
  secret:
    process.env.NODE_ENV === "production"
      ? productionSecret
      : configuredSecret || "teachvero-local-only-do-not-deploy-this-secret",
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
        const ip = clientKey(req.headers || {});
        if (!rateLimit("login:" + ip, 30)) return null;
        if (
          !credentials?.email ||
          credentials.email.length > 254 ||
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
