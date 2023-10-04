import { type TRPCContext } from "../trpc";

export class DbAdapter {
  constructor(public ctx: TRPCContext) {}
}
