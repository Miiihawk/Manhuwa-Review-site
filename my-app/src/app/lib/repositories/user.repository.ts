import { prisma } from "../prisma";
import { Role } from "@prisma-generated";

export class UserRepository {
  //Read
  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  findMany() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      omit: { passwordHash: true },
    });
  }

  findFirstAdmin() {
    return prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
  }

  //Create
  create(data: {
    username: string;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    return prisma.user.create({
      data: data,
    });
  }

  //Update
  update(
    id: number,
    data: {
      username?: string;
      email?: string;
      passwordHash?: string;
      bio?: string;
      profilePic?: string;
      role?: Role;
    },
  ) {
    return prisma.user.update({
      where: { id },
      data: data,
      omit: { passwordHash: true },
    });
  }
}

export const userRepository = new UserRepository();
