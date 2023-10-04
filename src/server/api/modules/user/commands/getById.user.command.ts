import { Command } from "@/server/api/base/base.command";
import { type userInput } from "@/server/api/inputs/user.input";
import { Prisma } from "@prisma/client";
import { UserDbAdapter } from "../adapter/user.db.adapter";

export type GetByIdUserCommandInput = typeof userInput.getById._output;

export class GetByIdUserCommand extends Command {
  protected readonly repository = new UserDbAdapter(this.ctx);

  async execute(input: GetByIdUserCommandInput) {
    const findFirstOrThrowArgs =
      Prisma.validator<Prisma.UserFindFirstOrThrowArgs>()({
        where: {
          id: input.id,
        },
        select: {
          email: true,
          id: true,
          name: true,
          UserRole: {
            include: {
              Role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

    return await this.repository.findFirstOrThrow(findFirstOrThrowArgs);
  }
}
