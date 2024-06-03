import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { honeypot } from '~/.server/honeypot.server'
import { setTheme } from '~/.server/theme.server'
import { AppRouteHandle } from '~/lib/types'

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'Set Theme' })
  // getSitemapEntries: () => null,
}

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark'])
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  try {
    honeypot.check(formData)
  } catch (error) {
    // @ts-expect-error error is a string most likely
    return json({ error: error.message }, { status: 400 })
  }

  const submission = parseWithZod(formData, {
    schema: ThemeFormSchema
  })

  invariantResponse(submission.status === 'success', 'Invalid theme submission')
  const { theme } = submission.value

  const responseInit = {
    headers: {
      'set-cookie': setTheme(theme)
    }
  }
  return json({ sucess: true, submission }, responseInit)
}
