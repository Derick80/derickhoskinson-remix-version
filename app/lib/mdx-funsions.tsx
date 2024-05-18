import * as mdxBundler from 'mdx-bundler/client/index.js'
import React from 'react'


const Paragraph = (props: { children?: React.ReactNode }) => {
  if (typeof props.children !== 'string' && props.children === 'img') {
    return <>{props.children}</>
  }

  return <p className='leading-7 [&:not(:first-child)]:mt-6' {...props} />
}

const mdxComponents = {
  p: Paragraph,

  h1: (props: { children?: React.ReactNode }) => <h1 className='text-4xl font-bold mt-8 mb-4' tabIndex={-1} { ...props }>{props.children || ''}</h1>,
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
