import { prisma } from '~/.server/prisma.server';

async function seed () {
    //   clear user data from the database
    await prisma.user.deleteMany();

    //   create a new user
    const userEmail = process.env.SEED_EMAIL

    if (!userEmail ) {
        throw new Error(`Please provide a valid email and password for seeding.`);
    }

    const user = await prisma.user.create({
        data: {
            email: userEmail,
            username: 'Derick',

        },
    });

    if (!user) {
        throw new Error(`User could not be created.`);
    }


    console.log(`Database has been seeded. with ${user.email} 🌱`);

}


seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
