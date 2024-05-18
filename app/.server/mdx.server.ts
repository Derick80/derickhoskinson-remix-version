import path from 'path'
import * as fsp from 'node:fs/promises'
import { bundleMDX } from 'mdx-bundler'
import rehypePrettyCode from 'rehype-pretty-code'
import { rehype } from 'rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypeShiki from '@shikijs/rehype'
import remarkSlug from 'remark-slug'
import remarkAutolinkHeadings from 'remark-autolink-headings'
export type FrontMatter = {
  title: string
  date: string
  author: string
  description: string
  published: boolean
  categories: string[]
}

// remarkSlug works

const getMDXFileContent = async (slug: string) => {
  const basePath = `${process.cwd()}/content/blog/`

  console.log(basePath, 'basepath')

  const source = await fsp.readFile(
    path.join(`${basePath}/${slug}.mdx`),
    'utf-8'
  )

  // bundle the mdx file
  console.log(process.cwd(), 'cwd')
  // put tis back maybe   it puts ids on my headings i saw.               rehypeSlug,
  const data = await bundleMDX({
    source,
    cwd: `${process.cwd()}/app/components/ui/`,
    mdxOptions: (options) => ({
      remarkPlugins: [...(options.remarkPlugins ?? []), remarkGfm],
      rehypePlugins: [
        ...(options.rehypePlugins ?? []),

              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
         [ rehypeShiki,
          {
            // or `theme` for a single theme
            themes: {
              light: 'vitesse-dark',
              dark: 'vitesse-dark'
            }
          }
]
      ]
    })
  })
  return data
}

export default getMDXFileContent
