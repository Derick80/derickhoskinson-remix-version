import { json, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import { honeypot } from './.server/honeypot.server';
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { isAuthenticated } from './.server/auth.server';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader ({ request }:LoaderFunctionArgs) {
    const user = await isAuthenticated(request)

	// more code here
	return json({ honeypotInputProps: honeypot.getInputProps(), user});
}
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
      className='h-screen bg-background text-foreground'
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export default function App () {
  const data = useLoaderData<typeof loader>();

  return		<HoneypotProvider {...data.honeypotInputProps}>

    <Outlet />;
  </HoneypotProvider>
}


export function useRootLoaderData() {
    return useRouteLoaderData<typeof loader>('root')
}

// copied and pasted this from another project
const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>Oops! Error</h1>
        <p className='text-lg text-red-700'>{`Status: ${error.status}`}</p>
        <p className='text-lg text-red-700'>{error.data.message}</p>
      </div>
    )
  }

  let errorMessage = 'Unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold text-red-600 mb-4'>Uh oh...</h1>
      <h2 className='text-xl font-semibold text-red-700 mb-4'>
        Something went wrong
      </h2>
      <pre className='text-lg text-red-700 whitespace-pre-wrap'>
        {errorMessage}
      </pre>
    </div>
  )
}
