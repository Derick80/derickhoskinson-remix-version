import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { getMDXFileContent } from '~/.server/mdx.server'
import { useLoaderData } from '@remix-run/react'
import { CodeBlock, useMdxComponent } from '~/lib/mdx-functions'
import { getLoaderDataForHandle } from '~/components/layout/breadcrumbs'
import { AppRouteHandle } from '~/lib/types'
import { mergeMeta } from '~/lib/meta'
import { notFoundMeta } from './$'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { codeToHtml } from 'shiki'

const slugSchema = z.object({
  slug: z.string()
})

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = slugSchema.parse(params)
  if (!slug) throw new Error('No data found')

  const { code, frontmatter } = await getMDXFileContent(slug)

  if (!code || !frontmatter) throw new Error('No data found')

  return json({ code, frontmatter, slug })
}

export const handle: AppRouteHandle = {
  breadcrumb: (matches) => {
    const data = getLoaderDataForHandle<typeof loader>(
      'routes/blog.$slug',
      matches
    )

    return { title: data?.frontmatter.title ?? 'Not Found' }
  }
}

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) return notFoundMeta

  const { slug } = slugSchema.parse(params)

  return [
    { title: `Blog Post: ${slug}` },
    { name: 'description', content: `Read the post with the ${slug} category` }
  ]
})

export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.code)

  return (
    <div className='rounded-md text-wrap shadow p-1 pt-0 prose  prosse-slate dark-prosse-invert'>
      <Component

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
