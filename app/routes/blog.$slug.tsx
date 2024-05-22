import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { getMDXFileContent } from '~/.server/mdx.server'
import { useLoaderData } from '@remix-run/react'
import { useMdxComponent } from '~/lib/mdx-functions'
import { getLoaderDataForHandle } from '~/components/layout/breadcrumbs'
import { AppRouteHandle } from '~/lib/types'
import { mergeMeta } from '~/lib/meta'
import { notFoundMeta } from './$'

const slugSchema = z.object({
  slug: z.string()
})

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = slugSchema.parse(params)
  if (!slug) throw new Error('No data found')

  const data = await getMDXFileContent(slug)
  if (!data) throw new Error('No data found')

  return json({ data, slug })
}
export const handle: AppRouteHandle = {
  breadcrumb: (matches) => {
    const data = getLoaderDataForHandle<typeof loader>(
      'routes/blog.$slug',
      matches
    )

    return { title: data?.data?.frontmatter.title ?? 'Not Found' }
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
  const Component = useMdxComponent(data.data.code)

  return (
    <div className='rounded-md bg-card text-wrap text-card-foreground shadow p-1 pt-0'>
      <Component />
    </div>
  )
}
