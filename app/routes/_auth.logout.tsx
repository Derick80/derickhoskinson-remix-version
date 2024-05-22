import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { authenticator } from '~/.server/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/' })
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/' })
}

export const meta: MetaFunction = () => [{ title: 'Log out of DerickHoskinson.com' }]