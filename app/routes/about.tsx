import { json } from '@remix-run/node'
import { getMDXPage } from '~/.server/mdx.server'
import { useLoaderData } from '@remix-run/react'
import { useMdxComponent } from '~/lib/mdx-functions'

export async function loader() {
  const aboutMe = await getMDXPage('about')
  return json({ aboutMe })
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
