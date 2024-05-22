import { json } from '@remix-run/node'

export async function loader() {
  return json(
    {
      name: 'DerickHoskinson.com',
      short_name: 'DH.com',
      lang: 'en-US',
      start_url: '/',
      display: 'minimal-ui'
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Type': 'application/manifest+json'
      }
    }
  )
}
