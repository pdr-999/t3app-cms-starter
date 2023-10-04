import { env } from "@/env";
import { prisma } from "@/server/db";
import { client } from "@/utils/api";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import dayjs from "dayjs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type DefaultJWT, type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";
import { type SessionUser } from "./api/routers/auth";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id?: number;
    };
    accessToken?: string;
  }

  interface User extends SessionUser {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExp?: number;
    accessTokenIat?: number;
    id?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    refreshToken?: string;
    accessToken?: string;
    /** Expiry of token from backend */
    accessTokenExp?: number;
    accessTokenIat?: number;
    permissions?: string[];
    id?: number;
    iat?: number;
    /** Expiry of token from next-auth, extended everytime session is called */
    exp?: number;
  }
}

const refreshAccessTokenIfExpired = async (token: JWT) => {
  if (token.accessTokenExp) {
    const now = dayjs().unix();

    if (token.accessTokenExp <= now) {
      if (!token.refreshToken) {
        return { ok: false, token };
      }
      const res = await client.auth.refreshAccessToken.mutate({
        refreshToken: token.refreshToken,
      });

      // Tokens
      token.accessToken = res.accessToken;
      token.accessTokenExp = res.tokenExp;
      token.accessTokenIat = res.tokenIat;

      // User
      token.permissions = res.user.permissions;
      token.email = res.user.email;
      token.name = res.user.name;
      token.picture =
        "https://ui-avatars.com/api/?name=" + res.user.name.replace(" ", "+");
    }
  }

  return { ok: true, token };
};
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // Enable debug messages in the console if you are having problems
  debug: true,
  callbacks: {
    async jwt(params) {
      const user = params.user;
      let token = params.token;
      try {
        if (user?.id) {
          // User
          token.id = typeof user.id === "string" ? parseInt(user.id) : user.id;
          token.permissions = user.permissions;

          // Tokens
          token.accessToken = user.accessToken;
          token.accessTokenExp = user.accessTokenExp;
          token.accessTokenIat = user.accessTokenIat;
          token.refreshToken = user.refreshToken;
        }

        /** Start refresh token */
        const { ok, token: newToken } = await refreshAccessTokenIfExpired(
          token
        );
        if (!ok) {
          await signOut({ redirect: false, callbackUrl: "/" });
        }
        token = newToken;

        return Promise.resolve(token);
      } catch (err) {
        await signOut({ redirect: false, callbackUrl: "/" });
        return Promise.resolve(token);
      }
    },
    async session(params) {
      const token = params.token;
      const session = params.session;
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        // Add if needed
        // session.user.neededKeyHere = token.providedTokenHere
      }

      return Promise.resolve(session);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: env.REFRESH_TOKEN_DURATION_IN_MONTHS * 60 * 60 * 24 * 30, // 3 Months
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        id: {},
        email: {},
        password: {},
      },
      /**
       * Response of authorize is passed to jwt's params.user
       * @param credentials
       * @returns
       */
      async authorize(credentials) {
        const res = await client.auth.login.mutate({
          email: credentials?.email ?? "",
          password: credentials?.password ?? "",
        });

        return {
          ...res.user,
          accessToken: res.accessToken,
          accessTokenExp: res.tokenExp,
          accessTokenIat: res.tokenIat,
          refreshToken: res.refreshToken,
          email: res.user.email,
          name: res.user.name,
          image:
            "https://ui-avatars.com/api/?name=" +
            res.user.name.replace(" ", "+"),
          id: res.user.id,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
