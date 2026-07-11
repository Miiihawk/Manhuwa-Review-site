import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import type { RegisterInput } from "../validators/user.schema.ts";

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

    const user = await userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
      role: "USER",
    });
  }
}

export const userService = new UserService();
