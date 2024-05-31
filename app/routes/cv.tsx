import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getMDXFileContent } from '~/.server/mdx.server'

import { GeneralErrorBoundary } from '~/components/error-boundry'
import { useMdxComponent } from '~/lib/mdx-functions'
import { AppRouteHandle } from '~/lib/types'

export async function loader ({ request, params }: LoaderFunctionArgs) {
  console.log('params', request);

  const cv = await getMDXFileContent(
 'pages', 'resume'
  )
  return json({ cv })
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'Curriculum Vite' })
}

export default function CvRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.cv.code)
  return (
    <div>
      <h1>Hello world!</h1>
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
