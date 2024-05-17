import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs
} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useFetchers,
  useLoaderData,
  useRouteLoaderData
} from '@remix-run/react'
import { parseWithZod } from '@conform-to/zod'
import { getFormProps, useForm } from '@conform-to/react'
import stylesheet from '~/tailwind.css?url'
import { honeypot } from './.server/honeypot.server'
import { HoneypotInputs, HoneypotProvider } from 'remix-utils/honeypot/react'
import { isAuthenticated } from './.server/auth.server'
import { SunIcon, MoonIcon, LaptopIcon } from '@radix-ui/react-icons'
import { z } from 'zod'
import { getTheme, setTheme, Theme } from './.server/theme.server'
import { ClientHintCheck, getHints, useHints } from './lib/client-hints'
import { invariantResponse } from '@epic-web/invariant'
import { useRequestInfo } from './lib/request-info'
import { useNonce } from './lib/nonce-providers'
import { GeneralErrorBoundary } from './components/error-boundry'
import { getEnv } from './.server/env.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)

  // more code here
  return json({
    honeypotInputProps: honeypot.getInputProps(),
    user,
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request)
      }
    },
    ENV: getEnv()
  })
}

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
  return json({ result: submission.reply() }, responseInit)
}

function Document({
  children,
  nonce,
  theme = 'light',
  env = {}
}: {
  children: React.ReactNode
  nonce: string
  theme?: Theme
  env?: Record<string, string>
}) {
  return (
    <html lang='en' className={`${theme} h-full overflow-x-hidden`}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='robots' content='noindex, nofollow' />

        <Links />
      </head>
      <body className='bg-background text-foreground'>
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}
function App() {
  const data = useLoaderData<typeof loader>()
  const theme = useTheme()
  const nonce = useNonce()

  return (
    <Document nonce={nonce} theme={theme}>
      <div className='flex h-screen flex-col justify-between'>
        <header className='container py-6'></header>

        <div className='flex-1'>
          <Outlet />
        </div>

        <div className='container flex justify-between pb-5'>
          <ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
        </div>
      </div>
    </Document>
  )
}
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()

  return (
    <HoneypotProvider {...data.honeypotInputProps}>
      <App />
    </HoneypotProvider>
  )
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>('root')
}

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark'])
})
/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }
  return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find((f) => f.formAction === '/')

  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema
    })

    if (submission.status === 'success') {
      return submission.value.theme
    }
  }
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme | null }) {
  const fetcher = useFetcher<typeof action>()

  const [form] = useForm({
    id: 'theme-switch',
    lastResult: fetcher.data?.result
  })

  const optimisticMode = useOptimisticThemeMode()
  const mode = optimisticMode ?? userPreference ?? 'system'
  const nextMode =
    mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
  const modeLabel = {
    light: <SunIcon name='sun'></SunIcon>,
    dark: <MoonIcon name='moon'></MoonIcon>,
    system: <LaptopIcon name='laptop'></LaptopIcon>
  }

  return (
    <fetcher.Form method='POST' {...getFormProps(form)}>
      <HoneypotInputs label='Please leave this field blank' />

      <input type='hidden' name='theme' value={nextMode} />
      <div className='flex gap-2'>
        <button
          type='submit'
          className='flex h-8 w-8 cursor-pointer items-center justify-center'
        >
          {modeLabel[mode]}
        </button>
      </div>
    </fetcher.Form>
  )
}

// copied and pasted this from another project
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorBoundary = () => {
  // the nonce doesn't rely on the loader so we can access that
  const nonce = useNonce()

  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary />
    </Document>
  )
}
