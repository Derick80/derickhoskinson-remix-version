
import { useLoaderData } from '@remix-run/react';

import { type LoaderFunctionArgs, json } from '@remix-run/node';
import UserProfileCard from '~/components/user-profile-card';
import { isAuthenticated } from '~/.server/auth.server';
import { getUserProfile } from '~/.server/user-services.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
throw new Error("Unauthorized");
  }

  const userProfile = await getUserProfile(user.userId)
  if (!userProfile) {
    throw new Error('User profile not found')
  }

  return json({userProfile});
}
export default function UserRoute() {
  const {userProfile} = useLoaderData<typeof loader>();



    return (
        <div
            className= ''
        >
            <h1>User Route</h1>
        <UserProfileCard
            userProfile={userProfile}
        />
        </div>
    )
}