import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { sessionStorage } from '~/.server/auth.server'
import { getDirectoryFrontMatter } from '~/.server/mdx.server'
import { prisma } from '~/.server/prisma.server'
import { Icon } from '~/components/icon-component'
import {Cloudinary} from "@cloudinary/url-gen";
import { extractPublicId } from 'cloudinary-build-url'
// Import the responsive plugin
import {accessibility, AdvancedImage, lazyload, placeholder, responsive} from '@cloudinary/react';


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
  const publicId = extractPublicId(
    'https://res.cloudinary.com/dch-photo/image/upload/c_fit,h_300,w_400/v1675678833/Japan_2023/Kanazawa/PXL_20230201_023514635_upzfrv.jpg'
    ) //sample

    console.log('publicId', publicId);
    
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

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dch-photo'
  }
}); 
export default function Index() {
  const { users } = useLoaderData<typeof loader>()
  const imgtst = cld.image('Japan_2023/Kanazawa/PXL_20230201_023514635_upzfrv')
  return (
    <div>
      <h1>Hello world!</h1>
      <h2>Users</h2>
      <div 
        className='w-full h-20'
      >
    <AdvancedImage 
      width='400px' height='300px'
    cldImg={imgtst}plugins={[lazyload(), responsive({
      steps: [200, 400, 800, 1600, 2000],
    }), accessibility(), placeholder({mode: 'blur'}
      
    )]}
></AdvancedImage>
</div>
      <ShinyRockBadge />
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
      <div className='glass-card'>
        The serene landscape stretched out before her, a patchwork of greens and
        yellows beneath a clear blue sky. Birds chirped merrily in the distance,
        their songs a perfect accompaniment to the gentle rustling of the
        leaves. The sun cast a warm glow, bathing everything in its golden
        light. She took a deep breath, savoring the fresh, crisp air, feeling a
        sense of peace she had not known for years. This was her sanctuary, a
        place where worries melted away and time seemed to stand still.
      </div>
      <div className='flex flex-wrap gap-2'>
        <Icon name='color-pal' />
      </div>
      <h1>Welcome to DerickHoskinson.com</h1>
      <h3>Welcome to my website</h3>
    </div>
  )
}

const ShinyRockBadge = () => {
  return (
    <span className='badge-shiny-rock text-white font-bold px-4 py-2'>
      Shiny Rock Badge
    </span>
  )
}
