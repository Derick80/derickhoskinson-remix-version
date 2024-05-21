import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { FrontMatter, getDirectoryFrontMatter } from '~/.server/mdx.server'
import { Muted } from '~/components/layout/typography'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from '~/components/ui/card'

export async function loader() {
  const frontmatter = await getDirectoryFrontMatter('blog')
  return json({ frontmatter })
}

export default function BlogRoute() {
  const { frontmatter } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col items-center gap-2 px-2'>
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
    <article className='prose prose-slate w-full'>
      <Card>
        <CardHeader className='pb-1 pt-2'>
          <CardTitle>
            <Link to={`/blog/${frontmatter.slug}`}>
              <Muted>{frontmatter.title}</Muted>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-2 gap-4 w-full'>
          <CardDescription className='italic text-xs'>
                 {frontmatter.description}
          </CardDescription>
          <div className='flex flex-row gap-1 md:gap-2'>
            {frontmatter.categories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
          </div>

          <CardFooter>{frontmatter.author}</CardFooter>
        </CardContent>
      </Card>
    </article>
  )
}
