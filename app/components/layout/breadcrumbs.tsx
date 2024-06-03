import * as React from 'react'
import {
  NavLink,
  useLocation,
  useMatches,
  type UIMatch
} from '@remix-run/react'
import type { SerializeFrom } from '@remix-run/node'
import { Icon } from '../icon-component'
import { SlashIcon } from '@radix-ui/react-icons'

export default function Breadcrumbs() {
  const matches = useMatches()
  const { pathname: currentPathname } = useLocation()
  const matchesWithBreadcrumbData = matches.filter(hasHandleWithBreadcrumb)

  return (
    <ul>
      {matchesWithBreadcrumbData.map((match, matchIndex) => {
        const { title } = match.handle.breadcrumb(matches)
        const isActive = match.pathname === currentPathname

        return (
          <li key={match.id} className='inline text-xs'>
            {isActive ? title : <NavLink to={match.pathname}>{title}</NavLink>}
            {matchIndex < matchesWithBreadcrumbData.length - 1 ? (
              <SlashIcon className='inline' />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export type BreadcrumbHandle = {
  breadcrumb: (matches: ReturnType<typeof useMatches>) => {
    title: string | React.ReactElement
  }
}

function hasHandleWithBreadcrumb(
  match: UIMatch
): match is UIMatch<unknown, BreadcrumbHandle> {
  return (
    match.handle !== null &&
    typeof match.handle === 'object' &&
    'breadcrumb' in match.handle &&
    typeof match.handle.breadcrumb === 'function'
  )
}

/**
 * Gets loader data for an ancestor route from a route id and the `matches`
 * object returned from the `useMatches` function.
 */
export function getLoaderDataForHandle<Loader>(
  routeId: string,
  matches: ReturnType<typeof useMatches>
) {
  const uiMatch = matches.find((match) => match.id === routeId)
  if (!uiMatch) throw new Error(`No match found for route id "${routeId}"`)
  // match.data can be undefined in the case of a 404
  return uiMatch.data as SerializeFrom<Loader> | undefined
}
