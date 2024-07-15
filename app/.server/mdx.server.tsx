import path from 'path'
import * as fsp from 'fs/promises'
import fs from 'node:fs'
import { bundleMDX } from 'mdx-bundler'
import remarkGfm from 'remark-gfm'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import rehypePrettyCode, { LineElement } from 'rehype-pretty-code'
import rehypeHighLight from 'rehype-highlight'
import chalk from 'chalk'
import CodeBlock from '~/components/code-block'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

import '~/mdx.css'
import { Button } from '~/components/ui/button'
import { H1, H2, H3 } from '~/components/layout/typography'
export type FrontMatter ={
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

const rehypePCOptions = {
  theme: 'nord',
  grid: true,
  keepBackground: true,
  onVisitLine(node: LineElement) {
    node.properties.className = node.properties.className || []
    node.properties.className?.push('line')
  },
  onVisitHighlightedLine(node: LineElement, id: string) {
    node.properties.className = node.properties.className || []
    node.properties.className.push('line--highlighted')
  },
  onVisitHighlightedChars(node: LineElement, id: string) {
    node.properties.className = ['word--highlighted']
  }
}

// remarkSlug works
const getMDXFileContent = async (
  contentDir: string,
  slug: string
): Promise<{ code: string; frontmatter: FrontMatter }> => {
  const basePath = `${process.cwd()}/content/`
  const source = await fsp.readFile(
    path.join(`${basePath}/${contentDir}/${slug}.mdx`),
    'utf-8'
  )

  try {
    // bundle the mdx file
    // put tis back maybe   it puts ids on my headings i saw.               rehypeSlug,
    const data = await bundleMDX<FrontMatter>({
      source,
      cwd: path.join(process.cwd(), 'app', 'components'),
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm]

        options.rehypePlugins = [
          ...(options.rehypePlugins ?? [
            [rehypePrettyCode, rehypePCOptions],
            rehypeHighLight,
            rehypeSlug,
            [rehypeAutoLinkHeadings, { behavior: 'wrap' }]
          ])
        ]
        return {
          ...options
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
  } catch (error) {
    console.error(
      chalk.red(`MDX Compilation failed for /app/content/blog/${slug}`)
    )
  }

  return {
    code: '',
    frontmatter: {} as FrontMatter
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
 const allPostsData = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      const readingTimeResult = readingTime(matterResult.content);
      const wordCount = matterResult.content.split(/\s+/gu).length;
      const matterData = matterResult.data as FrontMatter & { content: string };

      matterData.published = matterData.published ?? false;
      matterData.slug = slug;
      matterData.content = matterResult.content;
      matterData.readingTime = readingTimeResult.text;
      matterData.wordCount = wordCount;

      return matterData;
    })
  );

  // Filter out posts that are not published
  const publishedPosts = allPostsData.filter((post) => post.published);

  return publishedPosts;
}

export { getMDXFileContent, getDirectoryFrontMatter }
// Compare this snippet from app/lib/mdx-functions.tsx:
