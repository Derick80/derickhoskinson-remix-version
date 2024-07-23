import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { getAllUsers } from '~/.server/user-services.server';

export async function loader({ request, params }: LoaderFunctionArgs) {

    const users = await getAllUsers()
    if (!users) {
        throw new Error('Users not found ')
    }

  return json({users});
}