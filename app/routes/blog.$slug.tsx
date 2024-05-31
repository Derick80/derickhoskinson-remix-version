import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { getMDXFileContent } from '~/.server/mdx.server'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useMdxComponent } from '~/lib/mdx-functions'
import { getLoaderDataForHandle } from '~/components/layout/breadcrumbs'
import { AppRouteHandle } from '~/lib/types'
import { mergeMeta } from '~/lib/meta'
import { notFoundMeta } from './$'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import CodeBlock from '~/components/code-block'
import { H1, H2, Muted } from '~/components/layout/typography'
import { M } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

const slugSchema = z.object({
  slug: z.string()
})

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = slugSchema.parse(params)
  if (!slug) throw new Error('No data found')

  const { code, frontmatter } = await getMDXFileContent('blog', slug)

  if (!code || !frontmatter) throw new Error('No data found')

  return json({ code, frontmatter, slug })
}

export const handle: AppRouteHandle = {
  breadcrumb: (matches) => {
    const data = getLoaderDataForHandle<typeof loader>(
      'routes/blog.$slug',
      matches
    )
    // concat some strings together to generate a different title

    return { title: data?.slug ?? 'Not Found' }
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
    <div className='flex prosse dark:prsose-invert flex-col rounded-md text-wrap shadow p-1 pt-0 gap-4'>
      <Outlet />
      <H1 >{data.frontmatter.title}</H1>
      <Muted>
        {data.frontmatter.readingTime}
     </Muted>
      <Muted>
        { data.frontmatter.wordCount } words
      </Muted>
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
