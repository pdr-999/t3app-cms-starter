import { z } from "zod";

export const paginationInput = {
  // type GenericColumn = {
  //   [N in keyof T]: N;
  // };

  // const genericColumn: GenericColumn = {} as GenericColumn;

  meta: z
    .object({
      page: z.number().default(1),
      perPage: z.number().default(10),
      // sortKey: z.nativeEnum(genericColumn), // Would be nice if this is possible
      sortKey: z.string().optional().default("id"),
      sortDir: z.enum(["asc", "desc"]).default("desc"),
    })
    .optional()
    .default({
      page: 1,
      perPage: 10,
      sortDir: "desc",
      sortKey: "id",
    }),
};
