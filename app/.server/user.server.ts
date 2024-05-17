import { redirect, SerializeFrom } from '@remix-run/node'
import { useRootLoaderData, loader as rootLoader } from '../root'
import { sessionStorage } from './auth.server'
import { prisma } from './prisma.server'
import { z } from 'zod'
export const sessionKey = 'authSession'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUser(user: any): user is SerializeFrom<typeof rootLoader>['user'] {
  return user && typeof user === 'object' && typeof user.id === 'string'
}

export function useOptionalUser() {
  const data = useRootLoaderData()
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}

export function useUser() {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    )
  }
  return maybeUser
}

// maybe usd this latter
export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, 'role'> | null,
  role: string
) {
  if (!user) return false
  return user.role === role
}
export async function getUserId(request: Request) {
  const authSession = await sessionStorage.getSession(
    request.headers.get('cookie')
  )

  const currentSession = authSession.get('sessionId')
  console.log(currentSession, 'sessionId from getUserId')
  const sessionId = currentSession
  // can I use zod to validate this?
  const sessionIdSchema = z.string()
  const seshId = sessionIdSchema.parse(sessionId)
  console.log(seshId, 'seshId from getUserId')

  if (!currentSession) return null
  const session = await prisma.session.findUnique({
    select: { user: true },
    // come back to fix this
    where: {
      id: seshId,
      expirationDate: { gt: new Date() }
    }
  })
  console.log(session, 'session from getUserId')

  if (!session?.user) {
    throw redirect('/', {
      headers: {
        'set-cookie': await sessionStorage.destroySession(authSession)
      }
    })
  }
  return session
}

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request)
  if (userId) {
    throw redirect('/')
  }
}
