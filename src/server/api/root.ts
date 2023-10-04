import { createTRPCRouter } from "@/server/api/trpc";
import { UserController } from "./modules/user/controllers/user.controller";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: new UserController().routerGroup(),
});

// export type definition of API
export type AppRouter = typeof appRouter;