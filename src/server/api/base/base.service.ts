import { type TRPCContext } from "../trpc";

export class Service {
  constructor(protected ctx: TRPCContext) {}
}
