import NotFound from '~/components/not-found'
import { mergeMeta } from '~/lib/meta'

export const notFoundMeta = [
  { title: 'Not Found' },
  { name: 'description', content: "There's nothing of interest here." }
]

export const meta = mergeMeta(() => notFoundMeta)

export default NotFound
