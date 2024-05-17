// create a loader that checks the login status

import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { sessionStorage } from '~/.server/auth.server'
export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await sessionStorage.getSession(
    request.headers.get('Cookie')
  )
  const currentSession = authSession.get('authSession')
  console.log(currentSession, 'sessionId from loginroute')

  // const user = await isAuthenticated(request)
  // if (user) return redirect('/')

  return json({})
}

export default function Login() {
  return (
    <Form action='/discord' method='post'>
      <HoneypotInputs label='Please leave this field blank' />

      <button>Login with Discord</button>
    </Form>
  )
}
