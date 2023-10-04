import { userInput } from "@/server/api/inputs/user.input";
import {
  createTRPCRouter,
  protectedProcedure,
  type TRPCContext,
} from "@/server/api/trpc";
import { CreateUserCommand } from "../commands/create.user.command";
import { DeleteUserCommand } from "../commands/delete.user.command";
import { GetAllUserCommand } from "../commands/getAll.user.command";
import { GetByIdUserCommand } from "../commands/getById.user.command";
import { UpdateUserCommand } from "../commands/update.user.command";

export class UserController {
  routerGroup() {
    return createTRPCRouter({
      create: protectedProcedure
        .input(userInput.create)
        .mutation(async ({ input, ctx }) => await this.create(input, ctx)),

      update: protectedProcedure
        .input(userInput.update)
        .mutation(async ({ input, ctx }) => await this.update(input, ctx)),

      delete: protectedProcedure
        .input(userInput.delete)
        .mutation(async ({ input, ctx }) => await this.delete(input, ctx)),

      getAll: protectedProcedure
        .input(userInput.getAll)
        .query(async ({ input, ctx }) => await this.getAll(input, ctx)),

      getById: protectedProcedure
        .input(userInput.getById)
        .query(async ({ input, ctx }) => await this.getById(input, ctx)),
    });
  }

  async create(input: typeof userInput.create._output, ctx: TRPCContext) {
    const commandHandler = new CreateUserCommand(ctx);

    return await commandHandler.execute(input);
  }

  async update(input: typeof userInput.update._output, ctx: TRPCContext) {
    const commandHandler = new UpdateUserCommand(ctx);

    return await commandHandler.execute(input);
  }

  async delete(input: typeof userInput.delete._output, ctx: TRPCContext) {
    const commandHandler = new DeleteUserCommand(ctx);

    return await commandHandler.execute(input);
  }

  async getAll(input: typeof userInput.getAll._output, ctx: TRPCContext) {
    const commandHandler = new GetAllUserCommand(ctx);
    const res = await commandHandler.execute(input);

    return res;
  }

  async getById(input: typeof userInput.getById._output, ctx: TRPCContext) {
    const commandHandler = new GetByIdUserCommand(ctx);

    return await commandHandler.execute(input);
  }
}
