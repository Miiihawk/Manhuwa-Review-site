import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import type { RegisterInput, LoginInput } from "../validators/user.schema";
import { Role } from "../../../../generated/prisma/client";

const BCRYPT_COST = 12;

export class UserService {
  async registerUser(input: RegisterInput) {
    const [existingEmail, existingUsername] = await Promise.all([
      userRepository.findByEmail(input.email),
      userRepository.findByUsername(input.username),
    ]);

    if (existingEmail) throw new Error("Email already exists");
    if (existingUsername) throw new Error("Username already exists");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

    return userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
      role: Role.USER, // default role
    });
  }

  async authenticate(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) return null;
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) return null;
    return user;
  }

  async seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "Admin email or password not set in environment variables.",
      );
      return;
    }

    const existingAdmin = await userRepository.findFirstAdmin();
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    const adminUser = await userRepository.create({
      username: "admin",
      email,
      passwordHash,
      role: Role.ADMIN,
    });
  }
}

export const userService = new UserService();
