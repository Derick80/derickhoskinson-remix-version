import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { AppRouteHandle } from '~/lib/types'

export async function loader({ request, params }: LoaderFunctionArgs) {
  return json({})
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'My Coding Projects' })
}

import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundry'

export default function ProjectRoute() {
  const data = useLoaderData<typeof loader>()

  return <div className=''></div>
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        400: ({ error }) => (
          <p>
            {error.status} {error.data}
          </p>
        ),
        404: ({ error }) => (
          <p>
            {error.status} {error.data}
          </p>
        )
      }}
    />
  )
}
