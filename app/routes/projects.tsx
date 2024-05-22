import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { AppRouteHandle } from '~/lib/types'

export async function loader({ request, params }: LoaderFunctionArgs) {
  return json({})
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'My Coding Projects' })
}

import { useLoaderData } from '@remix-run/react'

export default function ProjectRoute() {
  const data = useLoaderData<typeof loader>()

  return <div className=''></div>
}
