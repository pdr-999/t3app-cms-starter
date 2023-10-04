import { UserHelper } from "@/server/api/modules/user/helpers/user.helper";
import { type Prisma, type PrismaClient } from "@prisma/client";
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from "./roles";

// Admins
interface UserRolePermissionSeed {
  user: Prisma.UserCreateInput;
  role: Prisma.RoleCreateInput;
}

export const seedSuperAdmin = async (prisma: PrismaClient) => {
  await prisma.user.upsert({
    update: {},
    where: {
      email: "superadmin@email.com",
    },
    create: {
      email: "superadmin@email.com",
      name: "super admin",
      password: await UserHelper.hashPassword("superadmin"),
      created_at: new Date(),
      updated_at: new Date(),
      UserRole: {
        create: {
          Role: {
            connect: {
              name: SUPER_ADMIN_ROLE?.name,
            },
          },
        },
      },
    },
  });
};

export const seedNonadminUsers = async (prisma: PrismaClient) => {
  const nonAdminUsers: UserRolePermissionSeed[] = [
    {
      user: {
        name: "admin",
        email: "admin@email.com",
        password: "admin123",
      },
      role: {
        name: "ADMIN",
      },
    },
  ];

  // Create users
  for (const nonAdminUser of nonAdminUsers) {
    await prisma.user.upsert({
      where: {
        email: nonAdminUser.user.email,
      },
      create: {
        ...nonAdminUser.user,
        password: await UserHelper.hashPassword(nonAdminUser.user.password),
        UserRole: {
          create: {
            Role: {
              connect: {
                name: ADMIN_ROLE?.name,
              },
            },
          },
        },
      },
      update: {},
    });
  }
};
