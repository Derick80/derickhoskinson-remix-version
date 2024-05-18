/* eslint-disable jsx-a11y/alt-text */
import * as mdxBundler from 'mdx-bundler/client/index.js'
import React from 'react'
import { getImageBuilder, getImgProps } from '~/images'


const Paragraph = (props: { children?: React.ReactNode }) => {
  if (typeof props.children !== 'string' && props.children === 'img') {
    return <>{props.children}</>
  }

  return <p className='leading-7 [&:not(:first-child)]:mt-6' {...props} />
}
const BlogImage=({
  cloudinaryId,
  imgProps,
  transparentBackground,
}: {
  cloudinaryId: string
  imgProps: JSX.IntrinsicElements['img']
  transparentBackground?: boolean
}) =>{
  return (
    <img
      // @ts-expect-error classname is overridden by getImgProps
      className="w-full rounded-lg object-cover py-8"
      {...getImgProps(getImageBuilder(cloudinaryId, imgProps.alt), {
        widths: [350, 550, 700, 845, 1250, 1700, 2550],
        sizes: [
          '(max-width:1023px) 80vw',
          '(min-width:1024px) and (max-width:1620px) 50vw',
          '850px',
        ],
        transformations: {
          background: transparentBackground ? undefined : 'rgb:e6e9ee',
        },
      })}
      {...imgProps}
    />
  )
}
const mdxComponents = {
  p: Paragraph,
BlogImage,
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


export { BlogImage }