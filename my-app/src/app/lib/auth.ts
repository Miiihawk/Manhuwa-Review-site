import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { loginSchema } from "./validators/user.schema";
import { userService } from "./services/user.service";

class NoAccountError extends CredentialsSignin {
  code = "no_account";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid credentials");
        }

        let user;
        try {
          user = await userService.authenticate(parsed.data);
        } catch (err) {
          if (err instanceof Error && err.message === "USER_NOT_FOUND") {
            throw new NoAccountError();
          }
          throw err;
        }

        if (!user) {
          return null;
        }

        return {
          id: String((user as any).id),
          email: (user as any).email,
          name: (user as any).username,
          role: (user as any).role,
        };
      },
    }),
  ],
});
