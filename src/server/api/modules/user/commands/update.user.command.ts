import { Command } from "@/server/api/base/base.command";
import { type userInput } from "@/server/api/inputs/user.input";
import { type Prisma } from "@prisma/client";
import { UserDbAdapter } from "../adapter/user.db.adapter";
import { UserHelper } from "../helpers/user.helper";

export type UpdateUserCommandInput = typeof userInput.update._output;

export class UpdateUserCommand extends Command {
  protected readonly repository = new UserDbAdapter(this.ctx);

  async execute(input: UpdateUserCommandInput) {
    const userUpdateArgs: Prisma.UserUpdateArgs = {
      data: {
        email: input.email,
        name: input.name,
        password: input.repeatNewPassword
          ? await UserHelper.hashPassword(input.repeatNewPassword)
          : undefined,
        UserRole: {
          deleteMany: {},
          createMany: {
            data: input.UserRole,
          },
        },
      },
      where: {
        id: input.id,
      },
    };
    return await this.repository.update(userUpdateArgs);
  }
}
