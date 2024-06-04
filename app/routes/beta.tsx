import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { AppRouteHandle } from '~/lib/types'

export async function loader({}: LoaderFunctionArgs) {
  return json({})
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'Beta Route' })
}

export default function BetaRoute() {
  return (
    <div className='flex flex-1 items-center justify-center w-full'>

    </div>
  )
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
