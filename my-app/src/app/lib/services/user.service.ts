import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
} from "../validators/user.schema";
import { Role } from "../../../../generated/prisma/client";

const BCRYPT_COST = 12;

export class UserService {
  async registerUser(input: RegisterInput) {
    const [existingEmail, existingUsername] = await Promise.all([
      userRepository.findByEmail(input.email),
      userRepository.findByUsername(input.username),
    ]);

    if (existingEmail) throw new Error("EMAIL_TAKEN");
    if (existingUsername) throw new Error("USERNAME_TAKEN");

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
    if (!user) throw new Error("USER_NOT_FOUND");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) return null;

    if (!user.isActive) return null; // deactivated accounts can't log in

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

  async listUsers() {
    return userRepository.findMany();
  }

  async updateProfile(userId: number, input: UpdateProfileInput) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new Error("USER_NOT_FOUND");

    if (input.username && input.username !== existing.username) {
      const taken = await userRepository.findByUsername(input.username);
      if (taken) throw new Error("USERNAME_TAKEN");
    }

    const data: {
      username?: string;
      bio?: string;
      profilePic?: string;
      passwordHash?: string;
    } = {};
    if (input.username !== undefined) data.username = input.username;
    if (input.bio !== undefined) data.bio = input.bio;
    if (input.profilePic !== undefined) data.profilePic = input.profilePic;
    if (input.newPassword) {
      data.passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_COST);
    }

    return userRepository.update(userId, data);
  }

  async adminUpdateUser(
    actorId: number,
    userId: number,
    data: { role?: Role; isActive?: boolean },
  ) {
    const target = await userRepository.findById(userId);
    if (!target) throw new Error("USER_NOT_FOUND");

    if (userId === actorId) {
      if (data.role && data.role !== Role.ADMIN)
        throw new Error("CANNOT_DEMOTE_SELF");
      if (data.isActive === false) throw new Error("CANNOT_DEACTIVATE_SELF");
    }

    if (target.role === Role.ADMIN && data.role && data.role !== Role.ADMIN) {
      const admins = await userRepository.countAdmins();
      if (admins <= 1) throw new Error("LAST_ADMIN");
    }

    return userRepository.update(userId, {
      ...(data.role ? { role: data.role } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    });
  }

  async adminDeleteUser(actorId: number, userId: number) {
    if (userId === actorId) throw new Error("CANNOT_DELETE_SELF");

    const target = await userRepository.findById(userId);
    if (!target) throw new Error("USER_NOT_FOUND");

    if (target.role === Role.ADMIN) {
      const admins = await userRepository.countAdmins();
      if (admins <= 1) throw new Error("LAST_ADMIN");
    }

    return userRepository.delete(userId);
  }
  countUsers() {
    return userRepository.count();
  }
}

export const userService = new UserService();
