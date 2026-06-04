import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "dylanhauck@cwwide.com";
  const password = "Password123!";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: "Dylan",
      lastName: "Hauck",
      userType: "STAFF",
      isActive: true,
    },
  });

  console.log("Created admin user:");
  console.log({
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    userType: user.userType,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });