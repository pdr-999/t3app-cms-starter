import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { _pinologger } from "~/pinologger";
import { type TRPCError } from "@trpc/server";

interface PinoError extends TRPCError {
  input?: unknown;
}
// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: (param) => {
    const { path, error, input } = param;

    const pinoError: PinoError = error;
    pinoError.input = input;

    try {
      _pinologger.error(pinoError);
    } catch (err) {
      console.log(err);
    }
    if (env.ENV === "development") {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
      );
    }
  },
});

// TODO: Handle file too large error, Unexpected token 'B', "Body excee"... is not valid JSON
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "30mb",
    },
  },
};
