import { Command } from "@/server/api/base/base.command";
import { type userInput } from "@/server/api/inputs/user.input";
import { type Prisma } from "@prisma/client";
import { UserDbAdapter } from "../adapter/user.db.adapter";

export type DeleteUserCommandInput = typeof userInput.delete._output;

export class DeleteUserCommand extends Command {
  protected readonly repository = new UserDbAdapter(this.ctx);

  async execute(input: typeof userInput.delete._output) {
    const deleteArgs: Prisma.UserDeleteArgs = {
      where: {
        id: input.id,
      },
    };
    return await this.repository.delete(deleteArgs);
  }
}
