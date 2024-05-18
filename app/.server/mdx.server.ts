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


import {visit} from 'unist-util-visit'
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
          `trimCodeBlocks: Unexpected: codeStringNode type is not "text": ${codeStringNode.type}`,
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
      {type: 'element', tagName: 'pre'},
      function visitor(node, index, parent) {
        if (parent?.type !== 'element') return
        if (parent.tagName !== 'div') return
        if (parent.children.length !== 1 && index === 0) return
        Object.assign(parent, node)
      },
    )
  }
}

const remarkPlugins: U.PluggableList = [
    remarkGfm,
    // remarkSlug,
    // remarkAutolinkHeadings,
    // remarkCodeTitles,
]

const rehypePlugins: U.PluggableList = [
  trimCodeBlocks,
  removePreContainerDivs,
]

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
    mdxOptions(options) {
 options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkSlug,
          [remarkAutolinkHeadings, {behavior: 'wrap'}],
          remarkGfm,
          ...remarkPlugins,
        ],
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),

              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],

      ]
        return options
    }
  })
  return data
}

export default getMDXFileContent
