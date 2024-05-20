import { type TransformerOption } from '@cld-apis/types'
import { buildImageUrl, setConfig } from 'cloudinary-build-url'
import clsx from 'clsx'
import { type CSSProperties } from 'react'

setConfig({
  cloudName: 'dch-photo'
})

type ImageBuilder = {
  (transformations?: TransformerOption): string
  alt: string
  id: string
  className?: string
  style?: CSSProperties
}

const createImages = <
  ImageType extends Record<
    string,
    Pick<ImageBuilder, 'id' | 'alt' | 'className' | 'style'>
  >
>(
  images: ImageType
) => {
  const imageBuilders: Record<string, ImageBuilder> = {}
  for (const [name, { id, alt, className, style }] of Object.entries(images)) {
    imageBuilders[name] = getImageBuilder(id, alt, { className, style })
  }
  return imageBuilders as { [Name in keyof ImageType]: ImageBuilder }
}

function getImageBuilder(
  id: string,
  alt: string = '',
  { className, style }: { className?: string; style?: CSSProperties } = {}
): ImageBuilder {
  function imageBuilder(transformations?: TransformerOption) {
    return buildImageUrl(id, { transformations })
  }
  imageBuilder.alt = alt
  imageBuilder.id = id
  imageBuilder.className = className
  imageBuilder.style = style
  return imageBuilder
}

function getImgProps(
  imageBuilder: ImageBuilder,
  {
    widths,
    sizes,
    transformations,
    className,
    style
  }: {
    widths: Array<number>
    sizes: Array<string>
    transformations?: TransformerOption
    className?: string
    style?: CSSProperties
  }
) {
  const averageSize = Math.ceil(widths.reduce((a, s) => a + s) / widths.length)
  const aspectRatio = transformations?.resize?.aspectRatio
    ? transformations.resize.aspectRatio.replace(':', '/')
    : transformations?.resize?.height && transformations.resize.width
    ? `${transformations.resize.width}/${transformations.resize.height}`
    : imageBuilder.style?.aspectRatio

  return {
    style: {
      ...imageBuilder.style,
      aspectRatio,
      ...style
    },
    className: clsx(imageBuilder.className, className),
    alt: imageBuilder.alt,
    src: imageBuilder({
      quality: 'auto',
      format: 'auto',
      ...transformations,
      resize: { width: averageSize, ...transformations?.resize }
    }),
    srcSet: widths
      .map((width) =>
        [
          imageBuilder({
            quality: 'auto',
            format: 'auto',
            ...transformations,
            resize: { width, ...transformations?.resize }
          }),
          `${width}w`
        ].join(' ')
      )
      .join(', '),
    sizes: sizes.join(', '),
    crossOrigin: 'anonymous'
  } as const
}

export { getImgProps, getImageBuilder }
export type { ImageBuilder }
