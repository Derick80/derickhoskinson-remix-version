import path from 'path'
import * as fsp from 'node:fs/promises'
import fs from 'node:fs'
import { bundleMDX } from 'mdx-bundler'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import remarkAutolinkHeadings from 'remark-autolink-headings'
import matter from 'gray-matter'

export type FrontMatter = {
  slug: string
  title: string
  date: string
  author: string
  description: string
  published: boolean
  categories: string[]
}

import { visit } from 'unist-util-visit'
import type * as H from 'hast'
import type * as U from 'unified'

function trimCodeBlocks() {
  return async function transformer(tree: H.Root) {
    visit(tree, 'element', (preNode: H.Element) => {
      if (preNode.tagName !== 'pre' || !preNode.children.length) {
        return
      }
      const codeNode = preNode.children[0]
      if (
        !codeNode ||
        codeNode.type !== 'element' ||
        codeNode.tagName !== 'code'
      ) {
        return
      }
      const [codeStringNode] = codeNode.children
      if (!codeStringNode) return

      if (codeStringNode.type !== 'text') {
        console.warn(
          `trimCodeBlocks: Unexpected: codeStringNode type is not "text": ${codeStringNode.type}`
        )
        return
      }
      codeStringNode.value = codeStringNode.value.trim()
    })
  }
}

function removePreContainerDivs() {
  return async function preContainerDivsTransformer(tree: H.Root) {
    visit(
      tree,
      { type: 'element', tagName: 'pre' },
      function visitor(node, index, parent) {
        if (parent?.type !== 'element') return
        if (parent.tagName !== 'div') return
        if (parent.children.length !== 1 && index === 0) return
        Object.assign(parent, node)
      }
    )
  }
}


const remarkPlugins: U.PluggableList = [
  remarkGfm
  // remarkSlug,
  // remarkAutolinkHeadings,
  // remarkCodeTitles,
]

const rehypePlugins: U.PluggableList = [trimCodeBlocks, removePreContainerDivs]

// remarkSlug works

const getMDXFileContent = async (slug: string) => {
  const basePath = `${process.cwd()}/content/blog/`

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
    mdxOptions(options) {
      (options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        remarkGfm,
        ...remarkPlugins
      ]),
        (options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),

          ...rehypePlugins
        ])
      return options
    }
  })
  return data
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

    const matterData = matterResult.data as FrontMatter & {content: string}

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

  console.log(basePath, 'basepath')

  const source = await fsp.readFile(
    path.join(`${basePath}/${pagename}.mdx`),
    'utf-8'
  )

  // bundle the mdx file
  // put tis back maybe   it puts ids on my headings i saw.               rehypeSlug,
  const data = await bundleMDX({
    source,
    mdxOptions(options) {
      (options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        [remarkAutolinkHeadings, { behavior: 'wrap' }],
        remarkGfm,
        ...remarkPlugins
      ]),
        (options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),

          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ...rehypePlugins
        ])
      return options
    }
  })
  return data
}

export { getMDXFileContent, getDirectoryFrontMatter, getMDXPage }
