import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getMDXFileContent } from '~/.server/mdx.server'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { ImageWithPlaceholder } from '~/components/image-w-placehold'
import { useMdxComponent } from '~/lib/mdx-functions'
import { AppRouteHandle } from '~/lib/types'

export async function loader() {
  const aboutMe = await getMDXFileContent('pages', 'about')
  return json({ aboutMe })
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'About Dr. Derick Hoskinson, Phd' })
}

export default function AboutRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.aboutMe.code)
  return (
    <div className='relative border-2 border-red-500'>
      <Component />
      <ImageWithPlaceholder
        src={ `https://res.cloudinary.com/dch-photo/image/upload/v1717442678/Me/PXL_20230206_020710804_vvv8kl.jpg` }
        placeholderSrc='/assets/placeholder-user.jpg'
        className='h-64 w-full object-cover'
      />
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
