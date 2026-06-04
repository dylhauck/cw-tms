import { UserType } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      userType: UserType;
      customerId?: string | null;
    };
  }

  interface User {
    userType: UserType;
    customerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: UserType;
    customerId?: string | null;
  }
}