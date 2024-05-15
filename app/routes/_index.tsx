import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/.server/prisma.server';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export async function loader () {

  const users = await prisma.user.findMany();

  if(!users) {
    throw new Error('No users found');
  }

  console.log(users,'users');

  return json({ users });

}

export default function Index () {
  const { users } = useLoaderData<typeof loader>();
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
