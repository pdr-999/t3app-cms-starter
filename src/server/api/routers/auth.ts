import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type $Enums, type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import dayjs from "dayjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { UserHelper } from "../modules/user/helpers/user.helper";

const generateAccessToken = () => {
  if (!env.NEXTAUTH_SECRET) return;
  return jwt.sign({}, env.NEXTAUTH_SECRET, {
    expiresIn: env.ACCESS_TOKEN_DURATION,
  });
};

export type SessionUser = {
  permissions: string[];
  email: string;
  name: string;
  id: number;
};

export type AuthLoginResponse = {
  user: SessionUser;
  refreshToken: string;
  accessToken: string;
  tokenExp: number;
  tokenIat: number;
};

export type AuthRefreshTokenResponse = {
  user: SessionUser;
  accessToken: string;
  tokenExp: number;
  tokenIat: number;
};

type ContextPrisma = PrismaClient<Prisma.PrismaClientOptions, never>;

const getPermissions = async (
  prisma: ContextPrisma,
  userId: number
): Promise<{ permissions: string[] }> => {
  const permissions = new Set<$Enums.Permissions>();

  const userRoles = await prisma.userRole.findMany({
    where: {
      user_id: userId,
    },
    include: {
      Role: {
        include: {
          RolePermission: {
            include: {
              Permission: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const userRole of userRoles) {
    for (const permission of userRole.Role.RolePermission) {
      permissions.add(permission.Permission.name);
    }
  }

  if (userRoles.length === 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: "Couldn't find role",
      message: "User does not have any role",
    });
  }

  return {
    permissions: Array.from(permissions.values()),
  };
};

export function encodeWithSalt(value: string) {
  const hash = crypto.createHash("sha256"); // You can choose a different hash algorithm if needed
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  hash.update(value + env.NEXTAUTH_SECRET!);
  return hash.digest("hex");
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("base64").slice(0, 32);
};
export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation<AuthLoginResponse>(
      async ({ input: { email, password }, ctx }) => {
        const foundUser = await ctx.prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!foundUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            cause: "User is not found",
            message: "User is not found",
          });
        }

        const isAuthorized = await UserHelper.verifyPassword(
          foundUser.password,
          password
        );

        if (!isAuthorized) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: "Password is wrong",
            message: "Password is wrong",
          });
        }

        // Generate Access Token, Refresh Token, and Session
        const refreshToken = generateRefreshToken();

        const accessToken = generateAccessToken();

        if (!accessToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Could not generate access token",
            message: "Could not generate access token",
          });
        }

        const { exp, iat } = jwt.decode(accessToken) as JwtPayload;

        const ip_address = encodeWithSalt(ctx.ua.ip);

        const refreshTokenData = await ctx.prisma.refreshToken.upsert({
          create: {
            expires_at: dayjs()
              .add(env.REFRESH_TOKEN_DURATION_IN_MONTHS, "months")
              .toISOString(),
            ip_address,
            token: refreshToken,
            user_agent: ctx.ua.browser,
            os: ctx.ua.os,
            user_id: foundUser.id,
          },
          update: {
            expires_at: dayjs()
              .add(env.REFRESH_TOKEN_DURATION_IN_MONTHS, "months")
              .toISOString(),
            token: refreshToken,
          },
          where: {
            user_id_ip_address_user_agent_os: {
              ip_address,
              os: ctx.ua.os,
              user_agent: ctx.ua.browser,
              user_id: foundUser.id,
            },
          },
        });

        const { permissions } = await getPermissions(ctx.prisma, foundUser.id);

        return {
          user: {
            permissions,
            email: foundUser.email,
            name: foundUser.name,
            id: foundUser.id,
          },
          refreshToken: refreshTokenData.token,
          accessToken: accessToken,
          tokenExp: exp ?? 0,
          tokenIat: iat ?? 0,
        };
      }
    ),
  refreshAccessToken: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation<AuthRefreshTokenResponse>(
      async ({ input: { refreshToken }, ctx }) => {
        const foundRefreshToken =
          await ctx.prisma.refreshToken.findFirstOrThrow({
            where: {
              token: refreshToken,
            },
            include: {
              User: {},
            },
          });

        // Expiry
        if (new Date() >= foundRefreshToken.expires_at) {
          await ctx.prisma.refreshToken.delete({
            where: {
              token: refreshToken,
            },
          });

          throw new TRPCError({
            cause: "Refresh token has expired",
            code: "UNAUTHORIZED",
            message: "Refresh token has expired",
          });
        }

        if (!foundRefreshToken?.User)
          throw new TRPCError({
            cause: "No user associated with this refresh token",
            code: "UNAUTHORIZED",
            message: "No user associated with this refresh token",
          });

        const { permissions } = await getPermissions(
          ctx.prisma,
          foundRefreshToken.User.id
        );

        if (!foundRefreshToken) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            cause: "Refresh token is not found",
            message: "Refresh token is not found",
          });
        }

        const accessToken = generateAccessToken();

        if (!accessToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "Could not generate access token",
            message: "Could not generate access token",
          });
        }

        const { exp, iat } = jwt.decode(accessToken) as JwtPayload;
        return {
          user: {
            permissions,
            email: foundRefreshToken.User.email,
            name: foundRefreshToken.User.name,

            id: foundRefreshToken.id,
          },
          accessToken: accessToken,
          tokenExp: exp ?? 0,
          tokenIat: iat ?? 0,
        };
      }
    ),
});
