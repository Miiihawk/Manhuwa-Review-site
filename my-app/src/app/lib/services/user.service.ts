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
}

export const userService = new UserService();
