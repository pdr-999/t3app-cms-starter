import { $Enums, type PrismaClient } from "@prisma/client";

export const seedPermissions = async (prisma: PrismaClient) => {
  for (const permissionName of Object.values($Enums.Permissions)) {
    await prisma.permission.upsert({
      create: {
        name: permissionName,
      },
      update: {
        name: permissionName,
      },
      where: {
        name: permissionName,
      },
    });
  }
};
