// app/routes/auth/discord.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/.server/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect('/login')
}

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate('discord', request)
}
