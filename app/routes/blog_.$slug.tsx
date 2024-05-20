import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { getMDXFileContent } from '~/.server/mdx.server'

const slugSchema = z.object({
  slug: z.string()
})

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = slugSchema.parse(params)
  if (!slug) throw new Error('No data found')
  console.log(slug, 'slug')

  const data = await getMDXFileContent(slug)
  if (!data) throw new Error('No data found')

  return json({ data })
}

import { useLoaderData } from '@remix-run/react'
import { useMdxComponent } from '~/lib/mdx-functions'

export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.data.code)
  return (
    <div className=''>
      <Component />
    </div>
  )
}
//   const Component = useMdxComponent(data.data.code)
// const mdxexport = getMDXExport(data.data.code)
// console.log(mdxexport.toc, 'mdxexport')
