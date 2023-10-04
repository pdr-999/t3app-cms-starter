import { type TRPCContext } from "../trpc";

export class Command {
  constructor(protected ctx: TRPCContext) {}
}
