import { type $Enums, type Prisma, type PrismaClient } from "@prisma/client";

type CreatedRole = Prisma.RoleCreateInput & {
  permissions?: $Enums.Permissions[];
};

const roles: CreatedRole[] = [
  {
    name: "Super Admin",
    permissions: ["FullAccess"],
  },
  {
    name: "Admin",
    permissions: [
      "AuthorCreate",
      "AuthorDelete",
      "AuthorRead",
      "AuthorUpdate",
      "BookCreate",
      "BookDelete",
      "BookRead",
      "BookUpdate",
    ],
  },
];

export const SUPER_ADMIN_ROLE = roles[0];
export const ADMIN_ROLE = roles[1];

export const seedRoles = async (prisma: PrismaClient) => {
  for (const role of roles) {
    // Create roles
    const upsertedRole = await prisma.role.upsert({
      create: {
        name: role.name,
      },
      update: {
        name: role.name,
      },
      where: {
        name: role.name,
      },
    });

    // Attach permission to role
    for (const permission of role?.permissions ?? []) {
      const foundPermission = await prisma.permission.findUnique({
        where: {
          name: permission,
        },
      });

      if (!foundPermission)
        throw new Error("No permission found when attaching to role");

      await prisma.rolePermission.upsert({
        create: {
          role_id: upsertedRole.id,
          permission_id: foundPermission.id,
        },
        update: {
          role_id: upsertedRole.id,
          permission_id: foundPermission.id,
        },
        where: {
          role_id_permission_id: {
            role_id: upsertedRole.id,
            permission_id: foundPermission.id,
          },
        },
      });
    }
  }
};
