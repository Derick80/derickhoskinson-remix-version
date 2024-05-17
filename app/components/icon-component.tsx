import { type SVGProps } from "react"
import { type IconName } from "./icons/name"
import  href  from "./icons/sprite.svg"
import { cn } from '~/lib/utils'

export function Icon({
  name,
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName
}) {
  if (children) {
    return (
      <span className="inline-flex gap-x-2">
        <Icon name={ name } className={ className } {...props} />
        {children}
      </span>
    )
  }
  return (
    <svg {...props} className={`inline self-center h-4 w-4 ${className}`}>
      <use href={`${href}#${name}`} />
    </svg>
  )
}