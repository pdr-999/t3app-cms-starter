import { z } from "zod";
import { paginationInput } from "./_pagination.input";

export const userInput = {
  getAll: z.object(paginationInput).default({
    meta: undefined,
  }),

  create: z
    .object({
      email: z.string().min(1),
      name: z.string(),
      UserRole: z.object({ role_id: z.number() }).array(),
      newPassword: z.string(),
      repeatNewPassword: z.string(),
    })
    .refine((arg) => arg.newPassword === arg.repeatNewPassword, {
      message: "Konfirmasi Password tidak boleh berbeda",
      path: ["newPassword"],
    }),

  update: z
    .object({
      id: z.number(),
      email: z.string().min(1),
      name: z.string(),
      UserRole: z.object({ role_id: z.number() }).array(),
      newPassword: z.string().optional(),
      repeatNewPassword: z.string().optional(),
    })
    .refine((arg) => arg.newPassword === arg.repeatNewPassword, {
      message: "Konfirmasi Password tidak boleh berbeda",
      path: ["newPassword"],
    }),

  delete: z.object({ id: z.number() }),

  getById: z.object({ id: z.number() }),
};
