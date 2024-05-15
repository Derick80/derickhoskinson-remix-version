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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
     <h1 className="text-3xl font-bold underline">
      Hello world!
      </h1>
      <h2 className="text-2xl font-bold">Users</h2>
      <p className="text-lg font-bold">
        {users.map((user) => (
          <div key={user.id}>
            <p>{user.username}</p>
            <p>{user.email}</p>
          </div>
        ))}
</p>
    </div>
  );
}
