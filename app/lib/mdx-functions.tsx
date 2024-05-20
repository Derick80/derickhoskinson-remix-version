/* eslint-disable jsx-a11y/alt-text */
import * as mdxBundler from 'mdx-bundler/client/index.js'
import React from 'react'
import { getImageBuilder, getImgProps } from '~/images'

import { getHighlighter } from 'shiki'

interface CustomListProps {
  children: React.ReactNode
}

export const CustomUl: React.FC<CustomListProps> = ({ children }) => {
  return <ul className='list-disc list-inside pl-4'>{children}</ul>
}

export const CustomOl: React.FC<CustomListProps> = ({ children }) => {
  return <ol className='list-decimal list-inside pl-4'>{children}</ol>
}

export const CustomLi: React.FC<CustomListProps> = ({ children }) => {
  return <li className='mb-2'>{children}</li>
}

interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [highlightedCode, setHighlightedCode] = React.useState<string>('')

  React.useEffect(() => {
    async function highlight() {
      const highlighter = await getHighlighter({
        themes: ['nord'],
        langs: [
          'javascript',
          'typescript',
          'bash',
          'json',
          'css',
          'html',
          'jsx',
          'tsx'
        ]
      })
      const html = highlighter.codeToHtml(code, {
        lang: language,
        theme: 'nord'
      })
      setHighlightedCode(html)
    }

    highlight()
  }, [code, language])

  return (
    <div className='relative w-full overflow-x-auto'>
      <pre className='p-4 bg-gray-900 text-white rounded-md whitespace-pre-wrap'>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  )
}

const Paragraph = (props: { children?: React.ReactNode }) => {
  if (typeof props.children !== 'string' && props.children === 'img') {
    return <>{props.children}</>
  }

  return (
    <p className='text-base leading-7 [&:not(:first-child)]:mt-6' {...props} />
  )
}
const BlogImage = ({
  cloudinaryId,
  imgProps,
  transparentBackground
}: {
  cloudinaryId: string
  imgProps: JSX.IntrinsicElements['img']
  transparentBackground?: boolean
}) => {
  return (
    <img
      // @ts-expect-error classname is overridden by getImgProps
      className='w-full rounded-lg object-cover py-8'
      {...getImgProps(getImageBuilder(cloudinaryId, imgProps.alt), {
        widths: [350, 550, 700, 845, 1250, 1700, 2550],
        sizes: [
          '(max-width:1023px) 80vw',
          '(min-width:1024px) and (max-width:1620px) 50vw',
          '850px'
        ],
        transformations: {
          background: transparentBackground ? undefined : 'rgb:e6e9ee'
        }
      })}
      {...imgProps}
    />
  )
}
const mdxComponents = {
  p: Paragraph,
  BlogImage,
  h1: (props: { children?: React.ReactNode }) => (
    <h1
      className='font serif scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary'
      tabIndex={-1}
      {...props}
    >
      {props.children || ''}
    </h1>
  ),
  h2: (props: { children?: React.ReactNode }) => (
    <h2
      className='croll-m-20 border-b border-primary pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'
      tabIndex={-1}
      {...props}
    >
      {props.children || ''}
    </h2>
  ),
  h3: (props: { children?: React.ReactNode }) => (
    <h3
      className='scroll-m-20 text-xl font-semibold tracking-tight'
      tabIndex={-1}
      {...props}
    >
      {props.children || ''}
    </h3>
  ),
  h4: (props: { children?: React.ReactNode }) => (
    <h4
      className='text-lg font-semibold tracking-tighter'
      tabIndex={-1}
      {...props}
    >
      {props.children || ''}
    </h4>
  ),
  pre: (props: any) => {
    const { children } = props
    return (
      <CodeBlock
        code={children.props.children}
        language={children.props.className?.replace('language-', '')}
      />
    )
  },
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi
}

declare global {
  type MDXProvidedComponents = typeof mdxComponents
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

export { BlogImage, CodeBlock }
