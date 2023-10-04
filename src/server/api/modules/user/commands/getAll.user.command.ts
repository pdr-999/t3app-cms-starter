import { Command } from "@/server/api/base/base.command";
import { type userInput } from "@/server/api/inputs/user.input";
import { Prisma } from "@prisma/client";
import { UserDbAdapter } from "../adapter/user.db.adapter";

export type GetAllUserCommandInput = typeof userInput.getAll._output;

export class GetAllUserCommand extends Command {
  protected readonly repository = new UserDbAdapter(this.ctx);

  async execute(input: GetAllUserCommandInput) {
    const { page, perPage, sortKey = "id", sortDir = "asc" } = input.meta;

    const findManyArgs = Prisma.validator<Prisma.UserFindManyArgs>()({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
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
      orderBy: {
        [sortKey]: sortDir,
      },
    });
    const users = await this.repository.findMany(findManyArgs);
    const totalData = await this.repository.count({});

    return {
      data: users,
      page,
      perPage,
      totalData,
      totalPage: Math.ceil(totalData / perPage),
    };
  }
}
