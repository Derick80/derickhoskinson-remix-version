import path from 'path'
import * as fsp from 'fs/promises'
import fs from 'node:fs'
import { bundleMDX, MDXBundlerResult } from 'mdx-bundler'
import { getHighlighter, Highlighter } from 'shiki'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'
import { Root } from 'hast'
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta'
import rehypeShiki from '@shikijs/rehype'
import readingTime from 'reading-time'

interface FrontMatter {
  slug: string
  title: string
  date: string
  author: string
  description: string
  published: boolean
  categories: string[]
  readingTime?: string
  wordCount?: number
}

// remarkSlug works
const getMDXFileContent = async (
  slug: string
): Promise<{ code: string; frontmatter: FrontMatter }> => {
  const shikiHighlighter: Highlighter = await getHighlighter({
    themes: ['nord', 'light-plus'],
    langs: [
      'typescript',
      'javascript',
      'jsx',
      'tsx',
      'css',
      'html',
      'json',
      'markdown'
    ]
  })
  await shikiHighlighter.loadTheme('light-plus')

  const basePath = `${process.cwd()}/content/blog/`
  const source = await fsp.readFile(
    path.join(`${basePath}/${slug}.mdx`),
    'utf-8'
  )
  // bundle the mdx file
  // put tis back maybe   it puts ids on my headings i saw.               rehypeSlug,
  const data: MDXBundlerResult = await bundleMDX({
    source,
    cwd: path.join(process.cwd(), 'app', 'components', 'ui'),
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        remarkGfm
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? [
        ]),
        [rehypeAutolinkHeadings, { behavior: 'after' }],
        [rehypeShiki, {
          highlighter: shikiHighlighter,
          theme: 'light-plus',
          addLanguageClass: true,
          logLevel: 'error'


         }],
        rehypeInferReadingTimeMeta
      ]

      return {
        ...options,
        providerImportSource: '@mdx-js/react',

      }
    }
  })
  return {
    code: data.code,
    frontmatter: {
      ...data.frontmatter,
      readingTime: readingTime(data.code).text,
      wordCount: source.split(/\s+/gu).length
    }
  }
}

// get all the frontmatter from a directory.

const getDirectoryFrontMatter = async (directory: string) => {
  const postsDirectory = path.join(process.cwd(), `content/${directory}`)
  // get only the mdx files
  const mdxFiles = fs.readdirSync(postsDirectory).filter((file) => {
    return file.endsWith('.mdx')
  })

  if (!mdxFiles.length) throw new Error('No posts found')

  const allPostsData = mdxFiles.map(async (fileName) => {
    const slug = fileName.replace(/\.mdx$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    const matterData = matterResult.data as FrontMatter & { content: string }

    matterData.published = matterData.published ?? false
    matterData.slug = slug
    matterData.content = matterResult.content
    //

    return matterData
  })
  return Promise.all(allPostsData)
}

// get a single mdx page by name

const getMDXPage = async (pagename: string) => {
  const basePath = `${process.cwd()}/content/pages/`
  const source = await fsp.readFile(
    path.join(`${basePath}/${pagename}.mdx`),
    'utf-8'
  )
  async function bundleMdxContent(source: string) {
    const data = await bundleMDX({
      source,
      cwd: `${process.cwd()}/app/components/ui/`,
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkSlug,
          remarkGfm
        ]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'after' }],
          rehypeShiki,
          rehypeInferReadingTimeMeta
        ]
        return {
          ...options,
          providerImportSource: '@mdx-js/react'
        }
      }
    })

    return data
  }

  return await bundleMdxContent(source)
}

export { getMDXFileContent, getDirectoryFrontMatter, getMDXPage }
// Compare this snippet from app/lib/mdx-functions.tsx:
