import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { getMDXFileContent } from '~/.server/mdx.server'
import { useLoaderData } from '@remix-run/react'
import { useMdxComponent } from '~/lib/mdx-functions'

const slugSchema = z.object({
  slug: z.string()
})

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = slugSchema.parse(params)
  if (!slug) throw new Error('No data found')

  const data = await getMDXFileContent(slug)
  if (!data) throw new Error('No data found')

  return json({ data , slug})
}



export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  const Component = useMdxComponent(data.data.code)


  return (
    <div className='border-2 rounded-md bg-card text-wrap text-card-foreground shadow p-1 pt-0'>
      <Component />
    </div>
  )
}
