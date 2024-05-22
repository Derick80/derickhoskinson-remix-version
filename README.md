# Welcome to Remix

- [Remix Docs](https://remix.run/docs)


nvm use node v20.11.0
### Notes
- [SEO](https://github.com/nasa-gcn/remix-seo)
## Prisma Seeding in Development


- Until form login is working again login with discord and then copy paste the userId from prisma studio into the seed file

## Component Reference

- Accordian - <https://github.com/AllanSimoyi/PersonalWebsite/blob/main/app/core/components/AccordionItem.tsx>
- Resizeable  image component [reference](https://github.com/Habib-Shahzad/tiptap-resizable-image/tree/main/src/components)
- Blog Category Filter
  - [reference](https://github.com/kentcdodds/kentcdodds.com/blob/main/app/routes/blog.tsx)
  - https://github.com/wKovacs64/drinks/blob/dev/app/navigation/breadcrumbs.tsx

## Database Setup

I use [Render](https://render.com/) for hosting a postgress database using Prisma ORM.
Create a new database and then add the following environment variables to your `.env` file.

```sh
DATABASE_URL=''
```

## Image Upload Setup

Create a [Cloudinary](https://cloudinary.com/) account and add the following environment variables to your `.env` file.

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

1. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

# Welcome to Remix + Vite

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Tech Stack

- [Remix](https://remix.run/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Fly.io](https://fly.io/)
- [Cloudinary](https://cloudinary.com/)
- [Zod](https://zod.dev/)

## Additional Packages

- [Prettier Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [tsx](https://www.npmjs.com/package/tsx)
- [Remix Dev Tools](https://remix-development-tools.fly.dev/)
- [Remix Flat Routes](https://github.com/kiliman/remix-flat-routes)
- [Remix Auth](https://github.com/sergiodxa/remix-auth)

## ToDos

- [] Rewrite, refactor, or create new components derived from the original project.
  - [] brand-icon.tsx
  - [] user-placeholder.tsx
  - [] resume/index.ts
  - [] Prisma seed data
  - []

## Documentation

### scripts

I am trying to do a bunch of automation and one thing is to seed my db AND scan my project for updated content and update the db with the new content.

```Typescript
 "firstSeed": "npx prisma db push && npx prisma generate && npx prisma db seed && tsx scripts/init-seed.ts",
 ```

This should only be run once during the initial dev and production set up.  Using this at any other time will wipe your db. I should add some type of warning!

# zods stf
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

### Images

- [Blur Data URL Generator](https://blurred.dev/)
-

## Getting Started

- use ```openssl rand -hex 32``` to generate a secret key for the .env file

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
