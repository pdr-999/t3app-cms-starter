import { PrismaClient } from "@prisma/client";
import { parseArgs } from "node:util";
import { _pinologger } from "../pinologger/index";
import { seedPermissions } from "./seeders/permissions";
import { seedRoles } from "./seeders/roles";
import { seedNonadminUsers, seedSuperAdmin } from "./seeders/users";

const prisma = new PrismaClient();

async function main() {
  try {
    const {
      values: {},
    } = parseArgs({ options: { environment: { type: "string" } } });

    /**
     * Run this for all environemnt
     */
    await seedPermissions(prisma);
    await seedRoles(prisma);
    await seedSuperAdmin(prisma);
    await seedNonadminUsers(prisma);
  } catch (err) {
    console.log(err);
    _pinologger.error(err);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    _pinologger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
