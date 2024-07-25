import { prisma } from './prisma.server'

const getUserProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      avatarUrl: true,
      userimages: true
    }
  })
}

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatarUrl: true
    }
  })
}

export { getUserProfile, getAllUsers }
