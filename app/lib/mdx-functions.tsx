/* eslint-disable jsx-a11y/alt-text */
import * as mdxBundler from 'mdx-bundler/client/index.js'
import React, { ComponentPropsWithoutRef, FC } from 'react'
import { JSX } from 'react/jsx-runtime'
import CodeBlock from '~/components/code-block'
import { getImageBuilder, getImgProps } from '~/lib/images'
import { cn } from './utils'
import { Button } from '~/components/ui/button'

function Table({
  data
}: {
  data: {
    headers: string[]
    rows: string[][]
  }
}) {
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

interface CustomListProps {
  children: React.ReactNode
}

export const CustomUl: React.FC<CustomListProps> = ({ children }) => {
  return <ul className='list-disc list-inside pl-4'>{children}</ul>
}

export const CustomOl: React.FC<CustomListProps> = ({ children }) => {
  return <ol className='list-decimal list-inside pl-4'>{children}</ol>
}

export const CustomLi = (props: { children: React.ReactNode }) => {
  return <li className='text-base leading-7'>{props.children}</li>
}

const Paragraph = (props: { children?: React.ReactNode }) => {
  if (typeof props.children !== 'string' && props.children === 'img') {
    return <>{props.children}</>
  }

  return (
    <p
      className='leading- [&:not(:first-child)]:mt-6'
      {...props}
    />
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
type ElemProps = {
  children?: React.ReactNode
}
export function H2(props: ElemProps): React.ReactElement {
  return (
    <h2 className='text-2xl my-6 dark:text-blue-400 text-blue-800' {...props}>
      {props.children}
    </h2>
  )
}

const mdxComponents = {
  p: Paragraph,
  BlogImage,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  h2: H2,
  Table,
  pre: (({ className, ...props }: {
    className?: string
  } & ComponentPropsWithoutRef<'pre'>
  ) => (
    <pre
      className={ cn('mb-4 mt-6 overflow-x-auto  rounded-lg py-4',
      className
      ) }
      { ...props }
    />
  )),
  code: ({ className, ...props }: {
    className?: string
  } & ComponentPropsWithoutRef<'code'>
) => (

      <><CodeBlock
      className={ cn('rounded-lg', className) }
      { ...props } /><Button
        variant='default'
        onClick={ () => console.log('clicked') }
        className='absolute bottom-0 right-0'
      >
        Copy
      </Button></>

  ),
  CodeBlock,


}


declare global {
  type MDXProvidedComponents = typeof mdxComponents
}

/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code)

  function DCHMdxComponent({
    components,
    ...rest
  }: Parameters<typeof Component>['0']) {
    return (
      <Component
        // @ts-expect-error the types are not correct
        components={{ ...mdxComponents, ...components }}
        {...rest}
      />
    )
  }

  return DCHMdxComponent
}

function useMdxComponent (code: string) {

  return React.useMemo(() => {
    const component = getMdxComponent(code)
    return component
  }, [code])
}

export { useMdxComponent, BlogImage }
