
export type ProjectImage = {
  url: string
  alt: string
}
type TechnologyStack = {
  value: string
  url: string
}

export type Project = {
  title: string
  description: string
  primaryImage: string
  projectUrl: string
  githubUrl: string
  status: string
  projectImages?: ProjectImage[]
  technologyStacks: TechnologyStack[]
  features: { value: string }[]
}
export const projects = [
  {
      title: 'ACMG Variant Classification',
      description: 'A web app for ACMG Variant Classification',
      primaryImage:
          'https://res.cloudinary.com/dch-photo/image/upload/v1684398538/myr4wowmklv2pwyyumsj.webp',
      projectUrl: `https://main--jovial-platypus-2a8460.netlify.app/`,
      githubUrl: `https://github.com/Derick80/genes_23`,
      status: 'living',

      features: [
          { value: 'variant classification' },
          { value: 'gene search' },
          { value: 'gene list' },
          { value: 'variant list' },
          { value: 'variant search' },
          { value: 'variant details' },
          { value: 'gene details' },
          { value: 'variant classification details' }
      ],
      technologyStacks: [
          {
              value: 'Remix-run',
              url: 'https://remix.run/'
          },
          {
              value: 'HTML Forms',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
          },
          {
              value: 'TailwindCSS',
              url: 'https://tailwindcss.com/'
          },

          {
              value: 'Prisma',
              url: 'https://www.prisma.io/'
          },
          {
              value: 'Postgres',
              url: 'https://www.postgresql.org/'
          }
      ]
  },

  {
      title: 'Japan 2023 Image Carousel',
      description:
          'An Image Carousel built with React and Typescript and Tailwindcss',
      primaryImage:
          'https://remix-bucket.s3.us-east-2.amazonaws.com/mystock/photogallery.png',
      projectUrl: 'https://photogallery-3r9pc82rg-derick80.vercel.app/',
      githubUrl: 'https://github.com/Derick80/photogallery',
      status: 'livingArchive',
      features: [{ value: 'Image Carousel' }, { value: 'Pagination' }],
      technologyStacks: [
          {
              value: 'Remix-run',
              url: 'https://remix.run/'
          },
          {
              value: 'HTML Forms',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
          },
          {
              value: 'TailwindCSS',
              url: 'https://tailwindcss.com/'
          },

          {
              value: 'Prisma',
              url: 'https://www.prisma.io/'
          },
          {
              value: 'Postgres',
              url: 'https://www.postgresql.org/'
          }
      ]
  },
  {
      title: 'X rated Video Downloader',
      description: 'A web app for downloading X rated videos in .mp4 format',
      primaryImage:
          'https://res.cloudinary.com/dch-photo/image/upload/v1721864490/blog_testing_2024/xvideo_uzpzkl.png',
      projectUrl: `https://xdownloader.fly.dev/`,
      githubUrl: `https://github.com/Derick80/xvideo-downloader`,
      status: 'livingArchive',

      features: [
          { value: 'Download Images from a HTTP Response using the video url' },

      ],
      technologyStacks: [
          {
              value: 'Remix-run',
              url: 'https://remix.run/'
          },
          {
              value: 'HTML Forms',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
          },
          {
              value: 'TailwindCSS',
              url: 'https://tailwindcss.com/'
          },
          {
              value: 'Fly.io',
              url: 'https://fly.io/'
          }
      ]
  },
  {
      title: 'My Simple Portfolio site',
      description: 'A web simple NextJs app for my portfolio',
      primaryImage:
          'https://res.cloudinary.com/dch-photo/image/upload/v1721881922/blog_testing_2024/nextport.png',
      projectUrl: 'https://dhdotcom-next-beta.fly.dev/',
      githubUrl: `https://github.com/Derick80/dhdotcomnext`,
      status: 'living',

      features: [
          {
              value: 'Curriculum Vitae',
          },
          {
              value: 'Projects',
          },
          {
              value: 'Contact',
          },


      ],
      technologyStacks: [
          {
              value: 'NextJs',
              url: 'https://nextjs.org/'
          },
          {
              value: 'HTML Forms',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
          },
          {
              value: 'TailwindCSS',
              url: 'https://tailwindcss.com/'
          },
          {
              value: 'Fly.io',
              url: 'https://fly.io/'
          }
      ]
  },
]
