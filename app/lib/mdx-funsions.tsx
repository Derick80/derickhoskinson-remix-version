import * as mdxBundler from 'mdx-bundler/client/index.js'
import React from 'react'
import rehypePrettyCode from 'rehype-pretty-code'
import { codeToHtml } from 'shiki'
import {fromHtmlIsomorphic} from 'hast-util-from-html-isomorphic'
import {rehype} from 'rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Icon } from '~/components/icon-component'


interface TableData {
  headers: string[]
  rows: string[][]
}

interface TableProps {
  data: TableData
}
function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}


const Paragraph = (props: { children?: React.ReactNode }) => {
  if (typeof props.children !== 'string' && props.children === 'img') {
    return <>{props.children}</>
  }

  return <p className='leading-7 [&:not(:first-child)]:mt-6' {...props} />
}


const Code = (props: { children?: React.ReactNode }) => {
  return <code className='text-red-500 p-1' {...props} />

}


const mdxComponents = {
  p: Paragraph,

  h1: (props: { children?: React.ReactNode }) => <h1 className='text-4xl font-bold mt-8 mb-4' { ...props } />,
  code: Code,
  pre: (props: { children?: React.ReactNode }) => <pre className='flex flex-wrap w-full overflow-x-scroll p-2 text-green-500' { ...props } />
}
/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
export function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code)

  function DCHMdxComponent({
    components,
    ...rest
  }: Parameters<typeof Component>['0']) {
    return (
      <Component components={{ ...mdxComponents, ...components }} {...rest} />
    )
  }

  return DCHMdxComponent
}

export function useMdxComponent(code: string) {
  return React.useMemo(() => {
    const component = getMdxComponent(code)
    return component
  }, [code])
}
