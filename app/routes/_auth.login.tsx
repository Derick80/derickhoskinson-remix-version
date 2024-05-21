// create a loader that checks the login status

import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { sessionStorage } from '~/.server/auth.server'
import { Icon } from '~/components/icon-component'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import famPhoto from '/family_dl_thwxot.avif'

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
    <div className='border-2 border-yellow-600 flex flex-col h-full p-10 items-center'>
      <Card className='w-full md:w-1/2 h-auto flex flex-col justify-between items-center'>
        <CardHeader title='Login'>
          <CardTitle> Login or Register</CardTitle>
          <CardDescription>
            Would you like to react to my posts? Login or register to get
            started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img className='rounded-xl' src={famPhoto} alt='family photo' />
          <Form action='/discord' method='post'>
            <HoneypotInputs label='Please leave this field blank' />
            <p>Login with Discord</p>
            <Button
              className='w-full'
              type='submit'
              variant='default'
              size='lg'
            >
              <Icon name='discord-logo' />
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
