# Welcome to DerickHoskinson.com: A Remix & Vite Project

- [DerickHoskinson.com](https://derickhoskinson.com)

## Table of Contents

- [Welcome to DerickHoskinson.com: A Remix \& Vite Project](#welcome-to-derickhoskinsoncom-a-remix--vite-project)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
    - [Additional Packages](#additional-packages)
  - [Web References](#web-references)
  - [Component Reference](#component-reference)
  - [Database Setup](#database-setup)
  - [Authentication Setup](#authentication-setup)
  - [Image Upload Setup](#image-upload-setup)
  - [Scripts \& Other Automation](#scripts--other-automation)
  - [Code and Additional Information](#code-and-additional-information)
    - [Zod with Action discrimator](#zod-with-action-discrimator)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Remix Specific Commands \& Resources](#remix-specific-commands--resources)

## Tech Stack

- [Remix](https://remix.run/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [CockroachDB](https://www.cockroachlabs.com/)
- [Fly.io](https://fly.io/)
- [Cloudinary](https://cloudinary.com/)
- [Zod](https://zod.dev/)

## Features

- [x] Image Upload with Cloudinary
- [x] Blog using MDX

### Additional Packages

- [Prettier Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [tsx](https://www.npmjs.com/package/tsx)
- [Remix Dev Tools](https://remix-development-tools.fly.dev/)
- [Remix Flat Routes](https://github.com/kiliman/remix-flat-routes)
- [Remix Auth](https://github.com/sergiodxa/remix-auth)
- [Epic Stack Components](https://github.com/epicweb-dev/epic-stack)

## Web References

- [Knip](https://sergiodxa.com/tutorials/find-and-remove-unused-code-with-knip)
- [SEO](https://github.com/nasa-gcn/remix-seo)
- [Dependency Usage](https://sergiodxa.com/tutorials/find-and-remove-unused-code-with-knip)
- [SVG Icon Cli](https://www.jacobparis.com/content/svg-icons-with-cli)
- [Upload Image & Pending UI](https://www.jacobparis.com/content/remix-image-uploads)

## Component Reference

- [Blog Category Filter](https://github.com/kentcdodds/kentcdodds.com/blob/main/app/routes/blog.tsx)
- [Resizeable Image](https://github.com/Habib-Shahzad/tiptap-resizable-image/tree/main/src/components)
- [Breadcrumbs](https://github.com/wKovacs64/drinks/blob/dev/app/navigation/breadcrumbs.tsx)

## Database Setup

I am using Prisma with a PostgreSQL database. Locally during development I use a local postgress database. The Development and Production databases are hosted by CockroachDB.

```shellscript
npm install @prisma/cli --save-dev
```

## Authentication Setup

I am using Remix-Auth & Discord strategy for authentication.

- [Remix Auth](https://github.com/sergiodxa/remix-auth)
- [Remix Utils](https://github.com/sergiodxa/remix-utils)
- [Discord](https://discord.com/developers/applications)


## Image Upload Setup

Create a [Cloudinary](https://cloudinary.com/) account and add the following environment variables to your `.env` file.

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

## Scripts & Other Automation

I am trying to do a bunch of automation and one thing is to seed my db AND scan my project for updated content and update the db with the new content.

```Typescript
 "firstSeed": "npx prisma db push && npx prisma generate && npx prisma db seed && tsx scripts/init-seed.ts",
 ```

I am using the following to update my react and react-dom versions to the latest canary versions.

 ```json
  "overrides": {
    "react": "18.3.0-canary-c3048aab4-20240326",
    "react-dom": "18.3.0-canary-c3048aab4-20240326"
  }
  ```

This should only be run once during the initial dev and production set up.  Using this at any other time will wipe your db. I should add some type of warning!

## Code and Additional Information

### Zod with Action discrimator

- [Zod Discriminated Union](https://www.jacobparis.com/content/zod-actions-remix)

```Typescript
// This adds type narrowing by the intent property
const Schema = z.discriminatedUnion('intent', [
  z.object({ intent: z.literal('delete'), id: z.string() }),
  z.object({ intent: z.literal('create'), name: z.string() }),
]);

export async function action({ request }: ActionArgs) {
  const data = await zx.parseForm(request, Schema);
  switch (data.intent) {
    case 'delete':
      // data is now narrowed to { intent: 'delete', id: string }
      return;
    case 'create':
      // data is now narrowed to { intent: 'create', name: string }
      return;
    default:
      // data is now narrowed to never. This will error if a case is missing.
      const _exhaustiveCheck: never = data;
  }
};
```

## Environment Variables

- Generate SESSION Secrets
use ```openssl rand -hex 32``` to generate a secret key for the .env file

- Environment Variables
Create a `.env` file in the root of the project and add the following environment variables:

```shellscript
DATABASE_URL=
SESSION_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
DISCORD_CALLBACK_URL=
DISCORD_CLIENT_SECRET=
DISCORD_CLIENT_ID=
ALLOW_INDEXING=

```

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Remix Specific Commands & Resources

- [Serigo' Remix Blog](https://sergiodxa.com/)
- [Jacob Paris](https://www.jacobparis.com/)
- [Remix Docs](https://remix.run/docs/en/main)
