import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32)
      .optional(),
    bio: z.string().max(500, "Bio must be 500 characters or fewer").optional(),
    profilePic: z.string().max(500).optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72)
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const adminUpdateUserSchema = z
  .object({
    role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => d.role !== undefined || d.isActive !== undefined, {
    message: "Nothing to update",
  });

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
