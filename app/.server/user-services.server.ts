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




export { getUserProfile }