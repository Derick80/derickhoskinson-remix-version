import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { AppRouteHandle } from '~/lib/types'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { H1 } from '~/components/layout/typography'
import { Separator } from '~/components/ui/separator'
import { projects } from 'content/resources/projects'
import { ProjectCard } from '~/components/project-card'

export async function loader({ request, params }: LoaderFunctionArgs) {
  return json({})
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'Projects' })
}



export default function ProjectRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col gap-5 space-y-2 items-center'>
      <H1 className='pt-4'>My Coding Projects</H1>
      <Separator />

      <div className='-m-4 flex flex-wrap gap-2 justify-center  items-center'>
      { projects.map((project, index) => (
                    <ProjectCard
                        key={ index }
                        projects={ project }
                    />
                ))


                }
      </div>
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
