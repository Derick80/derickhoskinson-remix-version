import { AppRouteHandle } from '~/lib/types'
import { notFoundMeta } from './$'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { getLoaderDataForHandle } from '~/components/layout/breadcrumbs'
import { mergeMeta } from '~/lib/meta'
import { GeneralErrorBoundary } from '~/components/error-boundry'

const categorySlugSchema = z.object({
  category: z.string()
})

export async function loader({ request, params }: LoaderFunctionArgs) {
  const category = categorySlugSchema.parse(params).category

  if (!category) throw new Error('No data found')

  return json({
    category
  })
}

export const handle: AppRouteHandle = {
  breadcrumb: (matches) => {
    const data = getLoaderDataForHandle<typeof loader>('routes/root', matches)
    return {
      title: data ? (
        <div className='inline-flex gap-2'>
          <span>{matches.at(-1)?.params.category}</span>
          <span>( {data?.category} )</span>
        </div>
      ) : (
        'Not Found'
      )
    }
  }
}

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) return notFoundMeta
  const { category } = categorySlugSchema.parse(params)

  return [
    { title: `Posts with categories: ${category}` },
    {
      name: 'description',
      content: `All blog posts containing the ${category} category`
    }
  ]
})

export default function CategoryROute() {
  // const { frontmatter } = useLoaderData<typeof loader>();

  return (
    <div className='flex flex-col gap-2 px-1'>
      {/* <h1>Category: {frontmatter[0].categories}</h1> */}
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
