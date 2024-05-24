import { DiscordStrategy } from 'remix-auth-discord'
import { createUser, getAccount } from '../auth.server'
import { User } from '@prisma/client'
import { z } from 'zod'

const discordClientId = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
const discordCallbackUrl = process.env.DISCORD_CALLBACK_URL

if (!discordClientId || !discordClientSecret || !discordCallbackUrl) {
  throw new Error('Discord credentials are missing')
}

interface DiscordExtraParams extends Record<string, string | number> {
  scope: string
}

export type LoggedInUser = User['id']

const partialDiscordUserSchema = z.object({
  avatar: z.string().nullish(),
  discriminator: z.string(),
  id: z.string(),
  username: z.string(),
  global_name: z.string().nullish(),
  verified: z.boolean().nullish()
})
const partialDiscordConnectionsSchema = z.array(
  z.object({
    visibility: z.number(),
    verified: z.boolean(),
    name: z.string(),
    id: z.string(),
    type: z.string()
  })
)
const discordUserDetailsSchema = z.tuple([
  partialDiscordUserSchema,
  partialDiscordConnectionsSchema
])

export const discordStrategy = new DiscordStrategy(
  {
    clientID: discordClientId,
    clientSecret: discordClientSecret,
    callbackURL: discordCallbackUrl,
    // Provide all the scopes you want as an array
    scope: ['identify', 'email']
  },
  async ({
    accessToken,
    refreshToken,
    profile
  }): Promise<ProviderUserWithSession> => {
    const userEmail = profile.__json.email
    if (!userEmail) {
      throw new Error('Email is required')
    }

    const account = await getAccount({
      provider: profile.provider,
      providerAccountId: profile.id
    })

    if (account) {
      // If the user is already in the database, update the token and return the user
      return {
        userId: account.user.id,
        username: account.user.username || '',
        email: account.user.email,
        role: account.user.role || 'user',
        provider: account.provider,
        providerId: account.providerAccountId,
        token: accessToken,
        refreshToken,
        sessionId: account.user.sessions[0].id
      }
    }

    //   If the user is not in the database, create a new user
    const userData = {
      email: userEmail,
      username: profile.displayName || '',
      avatarUrl: profile.__json.avatar_decoration || '',
      provider: profile.provider,
      providerId: profile.id,
      token: accessToken,
      refreshToken,
      role: 'user'
    }

    const user = await createUser(userData)

    return {
      userId: user.id,
      username: user.username || '',
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      role: user.role || 'user',
      provider: profile.provider,
      providerId: profile.id,
      token: accessToken,
      refreshToken,
      sessionId: user.sessions[0].id
    }
  }
)

// https://github.com/Sendouc/sendou.ink/blob/rewrite/app/features/auth/core/DiscordStrategy.server.ts
