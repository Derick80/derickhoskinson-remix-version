import { SerializeFrom } from '@remix-run/node'
import { useRootLoaderData, loader as rootLoader } from '~/root'

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ??
    request.headers.get('host') ??
    new URL(request.url).host
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

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
