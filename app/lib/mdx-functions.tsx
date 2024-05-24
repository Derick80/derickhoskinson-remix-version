/* eslint-disable jsx-a11y/alt-text */
import * as mdxBundler from 'mdx-bundler/client/index.js'
import React from 'react'
import { getImageBuilder, getImgProps } from '~/lib/images'
import cn from 'classnames'
import { CheckCircledIcon, CopyIcon } from '@radix-ui/react-icons'
import { Button } from '~/components/ui/button'
import { useToast } from '~/components/ui/use-toast'


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
      className='text-base leading- font-serif [&:not(:first-child)]:mt-6'
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

type CodeBlockProps = {
  className?: string
  children?: React.ReactNode
}

function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [isServer, setIsServer] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    setIsServer(false)
  }, [])

  function handleCopied() {
    window.navigator.clipboard.writeText(children as string)
    setCopied(true)
    toast({
      title: 'Copied to clipboard'
    })
    window.setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  let language = null as string | null
  if (className) {
    language = className.replace(/language-/, 'typescript')
  }
  if (isServer) return null
  return language ? (
      <pre
        className={cn(
          'rounded-md p-4 overflow-x-auto relative',
          className
        )}
        {...props}
      >
        {language ? (
          <span className='text-xs absolute bottom-2 right-2'>{language}</span>
        ) : null}

        <Button
          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
          variant='default'
          size='sm'
          onClick={handleCopied}
        >
          {copied ? (
            <>
              <CopyIcon className='mr-2 h-3 w-3' /> Copied!
            </>
          ) : (
            <>
              <CheckCircledIcon className='mr-2 h-3 w-3' /> Copy
            </>
          )}
        </Button>

        {children}
      code
      </pre>
  ) : (
    <pre
      className={cn(
        'rounded-md p-4 overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
      </pre>
    )
}


const mdxComponents = {
  p: Paragraph,
  BlogImage,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  a: (props: { href: string; children: React.ReactNode }) => {
    return (
      <a
        className='hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50'
        {...props}
      >
        <span className='sr-only'>{props.children}</span>
      </a>
    )
  },
  h1: (props: { children: React.ReactNode }) => {
    return <h1 className='text-4xl font-bold'>{props.children}</h1>
  },
  h2: H2
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
      <Component
        // @ts-expect-error the types are not correct
        components={{ ...mdxComponents, ...components }}
        {...rest}
      />
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
