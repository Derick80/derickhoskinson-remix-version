import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { getDirectoryFrontMatter } from '~/.server/mdx.server'
import { GeneralErrorBoundary } from '~/components/error-boundry'
import { Caption, Muted } from '~/components/layout/typography'
import { Badge } from '~/components/ui/badge'
import { AppRouteHandle } from '~/lib/types'
import type { FrontMatter } from '~/.server/mdx.server'
export async function loader() {
  const frontmatter = await getDirectoryFrontMatter('blog')
  console.log(frontmatter)

  const categories = frontmatter.map((post) => post.categories).flat()
  const uniqueCategories = [...new Set(categories)]
  const countEachCategory: { [key: string]: number } = categories.reduce(
    (acc, category) => {
      acc[category] = acc[category] ? acc[category] + 1 : 1
      return acc
    },
    {} as { [key: string]: number }
  )
  // combine uniqueCategories and countEachCategory into an object
  const categoriesWithCount = uniqueCategories.map((category) => {
    return {
      category,
      count: countEachCategory[category]
    }
  })

  return json({ frontmatter })
}

export const handle: AppRouteHandle = {
  breadcrumb: () => {
    return {
      title: 'blog'
    }
  }
}

export const meta = () => {
  return [
    {
      title: 'Blog',
      description: 'A collection of blog posts'
    }
  ]
}

export default function BlogRoute() {
  const { frontmatter } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col gap-2 px-2'>
      <Outlet />
      <h1>Blog</h1>
      {frontmatter
        .sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <PostPreviews key={post.slug} {...post} />
        ))}
    </div>
  )
}

const PostPreviews = (frontmatter: FrontMatter) => {
  return (
    <article className=' w-full rounded-md bg-card text-card-foreground shadow  p-1 pt-0'>
      <div className='flex flex-col gap-2'>
        <h3 className='m-0'>
          <Link prefetch='intent' to={`/blog/${frontmatter.slug}`}>
            {frontmatter.title}
          </Link>
        </h3>
        <Muted className='indent italic text-sm'>
          {frontmatter.description}
        </Muted>
        <div className='flex flex-col gap-1 md:gap-2'>
          <div className='flex gap-1 items-center flex-wrap'>
            <Caption>Categories:</Caption>
            {frontmatter.categories.map((category) => (
              <Badge key={category}>
                <Link to={`/blog/categories/${category}`}>{category}</Link>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
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
