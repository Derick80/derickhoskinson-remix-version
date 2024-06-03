import { generateRobotsTxt } from '@nasa-gcn/remix-seo'

export function loader() {
  return generateRobotsTxt([
    { type: 'sitemap', value: 'https://derickhoskinson.com/sitemap.xml' },
    { type: 'disallow', value: '/admin' }
  ])
}
