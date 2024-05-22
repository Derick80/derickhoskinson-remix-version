import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { sessionStorage } from '~/.server/auth.server'
import { getDirectoryFrontMatter } from '~/.server/mdx.server'
import { prisma } from '~/.server/prisma.server'
import { Icon } from '~/components/icon-component'

export const meta: MetaFunction = () => {
  return [
    { title: `Derick's Home on the Web` },
    { name: 'description', content: 'Welcome to DerickHoskinson.com' },
    {
      name: 'keywords',
      content:
        'Learn Genetics, Talk Genetics, Talk Web Development, Learn Something new'
    },
    { name: 'robots', content: 'index,follow' },
    { name: 'googlebot', content: 'index,follow' }
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  // I need to figure out how to fix these types
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const sessionId = session.get('authSession')

  console.log(sessionId, 'sessionId from _index loader')
  const users = await prisma.user.findMany({
    include: {
      sessions: true,
      accounts: true
    }
  })
  const frontmatter = await getDirectoryFrontMatter('blog')
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

  return json({ users, frontmatter })
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Hello world!</h1>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <p>
        The serene landscape stretched out before her, a patchwork of greens and
        yellows beneath a clear blue sky. Birds chirped merrily in the distance,
        their songs a perfect accompaniment to the gentle rustling of the
        leaves. The sun cast a warm glow, bathing everything in its golden
        light. She took a deep breath, savoring the fresh, crisp air, feeling a
        sense of peace she had not known for years. This was her sanctuary, a
        place where worries melted away and time seemed to stand still.
      </p>
      <div className='flex flex-wrap gap-2'>
        <Icon name='color-pal' />
      </div>
      <h1>Welcome to DerickHoskinson.com</h1>
      <h3>Welcome to my website</h3>
    </div>
  )
}
