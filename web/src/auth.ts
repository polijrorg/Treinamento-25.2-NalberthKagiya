// src/auth.ts
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./app/(backend)/services/db";
import { customSession } from "better-auth/plugins";
// Correção de caminho aqui 👇
import { getUserRole } from "@/app/(backend)/services/auth";
import { expo } from "@better-auth/expo";
import { ResetPasswordEmail } from "./templates/ResetPasswordEmail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: true,
        output: true,
      },
    },
  },
  plugins: [
    expo(),
    customSession(async ({ user, session }) => {
      const role = await getUserRole(session.userId);
      return {
        role,
        user,
        session,
      };
    }),
    nextCookies(),
  ],
  trustedOrigins: ["http://localhost:3000"],
  idType: "string",
});