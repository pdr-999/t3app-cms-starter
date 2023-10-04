import { z } from "zod";

export const withId = z.object({
  id: z.number(),
});
