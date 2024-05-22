import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { AppRouteHandle } from '~/lib/types'
import { useRootLoaderData } from '~/root'

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'Blog Categories' })
}
export async function loader({}: LoaderFunctionArgs) {
  return json({})
}

export const meta = () => {
  return [
    {
      title: 'Blog Categories',
      description: 'All blog categories'
    }
  ]
}

export default function BlogCategoryRoute() {
  const categories = useRootLoaderData()?.categoriesWithCount

  return (
    <div className=''>
      <h1 className='text-3xl font-bold'>Blog Categories</h1>
      <ul className='grid grid-cols-2 md:grid-cols-3 gap-2'>
        {categories?.map((category, index) => (
          <Badge key={index} className=''>
            <a href={`/blog/categories/${category.category}`}>
              {category.category} ({category.count})
            </a>
          </Badge>
        ))}
      </ul>

      <Outlet />
    </div>
  )
}
