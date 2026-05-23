import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@nibras.ma";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "Admin@2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      name: "مسؤول إداري",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      email,
      passwordHash,
      name: "مسؤول إداري",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.applicationCounter.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      year: parseInt(process.env.TRACKING_YEAR ?? "2026", 10),
      value: 0,
    },
  });

  console.log(`✓ Admin user ready: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
