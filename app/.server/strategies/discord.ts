import { DiscordStrategy } from 'remix-auth-discord'
import { createUser, getAccount } from '../auth.server'
import { getEnv } from '../env.server'

const discordClientId = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
const discordCallbackUrl = process.env.DISCORD_CALLBACK_URL

if (!discordClientId || !discordClientSecret || !discordCallbackUrl) {
  throw new Error('Discord credentials are missing')
}
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
        avatarUrl: account.user.avatarUrl || '',
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
