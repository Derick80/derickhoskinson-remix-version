import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import getMDXFileContent from '~/.server/mdx.server'
import { useMdxComponent } from '~/lib/mdx-funsions'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const data = await getMDXFileContent('/database')
  if (!data) throw new Error('No data found')
  console.log(data, 'one post from blogroute')

  return json({ data })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()
  // const mdxexport = getMDXExport(data.data.code)
  // console.log(mdxexport.toc, 'mdxexport')
  const Component = useMdxComponent(data.data.code)
  return (
    <div className='flex flex-col gap-4 p-10 max-w-screen-lg'>
      <Component />
    </div>
  )
}
