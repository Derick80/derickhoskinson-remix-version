/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  SEED_EMAIL: z.string(),
  BASE_PASSWORD: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),

  // If you plan on using Sentry, uncomment this line
  // SENTRY_DSN: z.string(),
  // If you plan to use Resend, uncomment this line
  // RESEND_API_KEY: z.string(),
  // If you plan to use GitHub auth, remove the default:
  DISCORD_CLIENT_ID: z.string().default('MOCK_DISCORD_CLIENT_ID'),
  DISCORD_CLIENT_SECRET: z.string().default('MOCK_DISCORD_CLIENT_SECRET'),
  DISCORD_CALLBACK_URL: z.string().default('DISCORD_CALLBACK_URL'),
  ALLOW_INDEXING: z.enum(['true', 'false']).optional()
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env)

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    )

    throw new Error('Invalid environment variables')
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    ALLOW_INDEXING: z.enum(['true', 'false']).optional()
  }
}

type ENV = ReturnType<typeof getEnv>

// change const from var
declare global {
  const ENV: ENV
  interface Window {
    ENV: ENV
  }
}
