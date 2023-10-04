import { Command } from "@/server/api/base/base.command";
import { type userInput } from "@/server/api/inputs/user.input";
import { type Prisma } from "@prisma/client";
import { UserDbAdapter } from "../adapter/user.db.adapter";
import { UserHelper } from "../helpers/user.helper";

export class CreateUserCommand extends Command {
  protected readonly repository = new UserDbAdapter(this.ctx);

  async execute(input: typeof userInput.create._output) {
    // TODO: Delete sessions
    const { UserRole } = input;

    const createArgs: Prisma.UserCreateArgs = {
      data: {
        email: input.email,
        name: input.name,
        password: await UserHelper.hashPassword(input.repeatNewPassword),
        UserRole: {
          createMany: {
            data: UserRole,
          },
        },
      },
    };

    return await this.repository.create(createArgs);
  }
}
