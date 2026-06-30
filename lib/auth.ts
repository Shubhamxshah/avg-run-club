import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";

import { db } from "./db";

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
      displayPhoto: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      eventId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (
            user.email?.endsWith("@users.avg-run-club.local") &&
            user.phoneNumber
          ) {
            await db.user.update({
              where: { id: user.id },
              data: { phoneNumberVerified: true },
            });
          }
        },
      },
    },
  },
  plugins: [
    phoneNumber({
      requireVerification: false,
      sendOTP: ({ phoneNumber: phone, code }) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`[dev OTP] ${phone}: ${code}`);
        }
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
