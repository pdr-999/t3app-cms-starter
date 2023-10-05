import { DbAdapter } from "@/server/api/base/base.prisma.db.adapter";
import { type Prisma } from "@prisma/client";

export class UserDbAdapter extends DbAdapter {
  async create(data: Prisma.UserCreateArgs) {
    return await this.ctx.prisma.user.create(data);
  }

  async update(data: Prisma.UserUpdateArgs) {
    return await this.ctx.prisma.user.update(data);
  }

  async delete(data: Prisma.UserDeleteArgs) {
    return await this.ctx.prisma.user.delete(data);
  }

  async findMany<T extends Prisma.UserFindManyArgs>(
    data: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
  ) {
    return await this.ctx.prisma.user.findMany<T>(data);
  }

  async findFirstOrThrow<T extends Prisma.UserFindFirstOrThrowArgs>(
    data: Prisma.SelectSubset<T, Prisma.UserFindFirstOrThrowArgs>
  ) {
    return await this.ctx.prisma.user.findFirstOrThrow<T>(data);
  }

  async count(data: Prisma.UserCountArgs) {
    return await this.ctx.prisma.user.count(data);
  }
}
