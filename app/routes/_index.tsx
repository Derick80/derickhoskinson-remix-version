import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { sessionStorage } from '~/.server/auth.server';
import { prisma } from '~/.server/prisma.server';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export async function loader ({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  console.log(session.data,'session');


  const users = await prisma.user.findMany({
    include: {
      sessions: true,
      accounts: true,
    }
  });





  return json({ users });
}


export default function Index () {
  const { users,user } = useLoaderData<typeof loader>();
  console.log(users,'users');
  return (
    <div >
     <h1 className="text-3xl text-red-500 font-bold underline">
      Hello world!
      </h1>
      <h2 className="text-2xl font-bold text-purple-500 underline">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        )) }
      </ul>
    </div>
  );
}
