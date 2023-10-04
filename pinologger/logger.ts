import pino from "pino";

export const _pinologger = pino(
  {
    level: "error",
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  pino.transport({
    target: "@axiomhq/pino",
    options: {
      orgId: process.env.AXIOM_ORG_ID, // Can be found on settings page
      token: process.env.AXIOM_TOKEN, // Can be generated on settings > API Tokens
      dataset: process.env.AXIOM_DATASET,
    },
  })
);
