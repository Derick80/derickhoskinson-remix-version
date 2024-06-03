import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node'
import {
  Links,
  Meta,
  NavLink,
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
import { getTheme, Theme } from './.server/theme.server'
import { ClientHintCheck, getHints, useHints } from './lib/client-hints'
import { useRequestInfo } from './lib/request-info'
import { useNonce } from './lib/nonce-providers'
import { GeneralErrorBoundary } from './components/error-boundry'
import { getEnv } from './.server/env.server'
import { Icon } from './components/icon-component'
import { getDirectoryFrontMatter } from './.server/mdx.server'
import { AppRouteHandle } from './lib/types'
import Breadcrumbs from './components/layout/breadcrumbs'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/toaster'
import React from 'react'
import { Separator } from './components/ui/separator'
import UserMenu from './components/user-menu'
import { action } from './routes/_action.set-theme'

export const links: LinksFunction = () => [
  { rel: 'manifest', href: '/manifest.webmanifest' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&family=Slabo+27px&display=swap',
    crossOrigin: 'anonymous'
  },
  { rel: 'stylesheet', href: stylesheet }
]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)

  const frontmatter = await getDirectoryFrontMatter('blog')
  const categories = frontmatter.map((post) => post.categories).flat()
  const uniqueCategories = [...new Set(categories)]
  const countEachCategory: { [key: string]: number } = categories.reduce(
    (acc, category) => {
      acc[category] = acc[category] ? acc[category] + 1 : 1
      return acc
    },
    {} as { [key: string]: number }
  )
  // combine uniqueCategories and countEachCategory into an object
  const categoriesWithCount = uniqueCategories.map((category) => {
    return {
      category,
      count: countEachCategory[category]
    }
  })

  // more code here
  return json({
    honeypotInputProps: honeypot.getInputProps(),
    user,
    frontmatter,
    categoriesWithCount,
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request)
      }
    },
    ENV: getEnv()
  })
}

// export const shouldRevalidate = () => false

// this is preobably broken

export const meta: MetaFunction<typeof loader> = () => {
  const appName = 'DerickHoskinson.com'
  const title = 'DerickHoskinson.com'
  const description = 'DerickHoskinson.com'

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'application-name', content: appName },
    { name: 'apple-mobile-web-app-title', content: appName }
  ]
}

export const handle: AppRouteHandle = {
  breadcrumb: () => ({ title: 'DerickHoskinson.com' })
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
    <html lang='en' className={`${theme} h-full woverflow-x-hidden`}>
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
        <Toaster />
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

  const [isScrollingDown, setIsScrollingDown] = React.useState(false)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsScrollingDown(true)
      } else {
        setIsScrollingDown(false)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])
  return (
    <Document nonce={nonce} theme={theme}>
      <Toaster />
      <header
        className={`flex h-16 border-b-2 border-primary/10 fixed flex-row justify-between items-center px-0 top-0 ransition-transform duration-300 ease-in-out z-50 ${
          isScrollingDown ? '-translate-y-full' : ''
        }`}
      >
        <Icon name='apple'></Icon>

        <NavigationBar />
        <div className='flex gap-2'>
          <UserMenu />
          <ThemeSwitch userPreference={data.requestInfo.userPrefs.theme} />
        </div>
      </header>

      <div className='flex-1 min-h-screen px-4 pt-4'>
        <Breadcrumbs />
        <Separator />
        <Outlet />
      </div>

      <div className='container flex justify-between pb-5'>footer things</div>
    </Document>
  )
}
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()

  return (
    <TooltipProvider>
      <HoneypotProvider {...data.honeypotInputProps}>
        <App />
      </HoneypotProvider>
    </TooltipProvider>
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
  const themeFetcher = fetchers.find((f) => f.formAction === '/set-theme')

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
    lastResult: fetcher.data?.submission.value
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
    <fetcher.Form method='POST' {...getFormProps(form)} action='/set-theme'>
      <HoneypotInputs label='Please leave this field blank' />

      <input type='hidden' name='theme' value={nextMode} />

      <button
        type='submit'
        className='flex h-8 w-8 cursor-pointer items-center justify-center'
      >
        {modeLabel[mode]}
      </button>
    </fetcher.Form>
  )
}

/* Navigation Bar */

const NavigationBar = () => {
  return (
    <nav className='flex justify-between p-1'>
      <ul className='flex gap-4 items-center'>
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              prefetch='intent'
              to={item.path}
              className={({ isActive }) =>
                ` ${
                  isActive ? 'underline flex items-center' : 'flex items-center'
                }`
              }
              title={item.title}
            >
              {item.icon}
              <span className='hidden md:block'>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type MenuItem = {
  label: string
  title: string
  path: string
  icon: React.ReactNode
}
export const menuItems: MenuItem[] = [
  {
    label: 'Home',
    title: 'Click to go to the home page',
    path: '/',
    icon: <Icon name='castle'></Icon>
  },
  {
    label: 'Blog',
    title: 'View the blog posts',
    path: '/blog',
    icon: <Icon name='book'></Icon>
  },
  {
    label: 'About',
    title: 'Learn more about me',
    path: '/about',
    icon: <Icon name='coffee'></Icon>
  },
  {
    label: 'Projects',
    title: 'View the projects',
    path: '/projects',
    icon: <Icon name='calculator'></Icon>
  },
  {
    label: 'CV',
    title: 'View my CV',
    path: '/cv',
    icon: <Icon name='dna'></Icon>
  }
]

/* End Navigation */

export function ErrorBoundary({ error }: { error: Error }) {
  return <GeneralErrorBoundary error={error} />
}

// copied and pasted this from another project
// eslint-disable-next-line @typescript-eslint/no-unused-vars
