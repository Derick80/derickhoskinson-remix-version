// create a loader that checks the login status

import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { authenticator,sessionStorage } from '~/.server/auth.server';
export async function loader ({ request, params }: LoaderFunctionArgs) {
    const session = await sessionStorage.getSession(request.headers.get("cookie"))

    // if there's an error in the session, show it

    const error = session.get(authenticator.sessionErrorKey);
    if (error)
        {
  return json({ error }, {
    headers:{
      'Set-Cookie': await sessionStorage.commitSession(session) // You must commit the session whenever you read a flash
      }
  })
    }

    // otherwise, render the login page
    return json({ provider: authenticator.sessionStrategyKey });
}


       // app/routes/login.tsx

export default function Login() {
  return (
      <Form action="/discord" method="post">
        <HoneypotInputs label="Please leave this field blank" />

      <button>Login with Discord</button>
    </Form>
  );
}
