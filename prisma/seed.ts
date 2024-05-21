import { education, professionalExperience, pubs, resume_basics, skills } from 'content/resources/resume';
import { prisma } from '~/.server/prisma.server';

async function generateResume () {
  const init_resume = await prisma.resume.create({
    data: {
      title: resume_basics.title,
      phoneNumber: resume_basics.phoneNumber,
      email: resume_basics.email,
      website: resume_basics.website,
      location: resume_basics.location,
      summary: resume_basics.summary,
      skills: {
        create: skills
      },
      education: {
        create: {
          institution: education[0].institution,
          degree: education[0].degree,
          field: education[0].field,
          startDate: education[0].startDate,
          endDate: education[0].endDate,

        }

      },
      publications: {
        create: pubs

      }


    }
  }

  )
  if (init_resume) {
    for (let i = 0; i < professionalExperience.length; i++) {
      await prisma.professionalExperience.create({
        data: {
          title: professionalExperience[i].title,
          company: professionalExperience[i].company,
          location: professionalExperience[i].location,
          startDate: professionalExperience[i].startDate,
          endDate: professionalExperience[i].endDate,
          duties: {
            create: professionalExperience[i].duties
          },
          resume: {
            connect: {
              id: init_resume.id
            }
          }
        }

      })

    }
    for (let i = 0; i < education.length; i++) {
      await prisma.education.create({
        data: {
          institution: education[i].institution,
          degree: education[i].degree,
          field: education[i].field,
          startDate: education[i].startDate,
          endDate: education[i].endDate,
          duties: {
            create: education[i].duties

          },
          resume: {
            connect: {
              id: init_resume.id
            }
          },
        }

      })

    }

  }
  console.log(`Resume has been created.`);
}

async function seed () {
    //   clear user data from the database
    // await prisma.user.deleteMany();

    //   create a new user
    const userEmail = process.env.SEED_EMAIL

    if (!userEmail ) {
        throw new Error(`Please provide a valid email and password for seeding.`);
    }

    const user = await prisma.user.upsert({
        where: {
            email: userEmail
        },
        update: {},
        create: {
          email: userEmail,

        }

    });

    if (!user) {
        throw new Error(`User could not be created.`);
    }

    await generateResume();

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
