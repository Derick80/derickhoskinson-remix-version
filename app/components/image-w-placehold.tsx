import React from "react"

/**
 * @tutorial https://www.jacobparis.com/content/image-placeholders
 */
export function ImageWithPlaceholder({
  src,
  placeholderSrc,
  onLoad,
  ...props
}: {
  src: string
  placeholderSrc?: string
  onLoad?: () => void
  className?: string
}) {
  const [imgSrc, setImgSrc] = React.useState(placeholderSrc || src)

  const onLoadRef = React.useRef(onLoad)

  React.useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])

  React.useEffect(() => {
    const img = new Image()

    img.onload = () => {
      setImgSrc(src)
      if (onLoadRef.current) {
        onLoadRef.current()
      }
    }

    img.src = src
  }, [src])

  return <img src={imgSrc} alt="" {...props} />
}