import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getMDXPage } from '~/.server/mdx.server'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { useMdxComponent } from '~/lib/mdx-functions'
import { AppRouteHandle } from '~/lib/types'

export async function loader() {
  const aboutMe = await getMDXPage('about')
  return json({ aboutMe })
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'About Dr. Derick Hoskinson, Phd' })
}

export default function AboutRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.aboutMe.code)
  return (
    <div className='flex flex-col'>
      <Component />
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
