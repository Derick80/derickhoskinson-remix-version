import { generateSitemap } from '@nasa-gcn/remix-seo'
import { type ServerBuild, type LoaderFunctionArgs } from '@remix-run/node'
import { getDomainUrl } from '../lib/misc'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const serverBuild = (await context.serverBuild) as ServerBuild
  return generateSitemap(request, serverBuild.routes, {
    siteUrl: getDomainUrl(request),
    headers: {
      'Cache-Control': `public, max-age=${
        60 * 60 * 24 * 7 // 1 week
      }` // 5 minutes
    }
  })
}
