// instantiate PrismaClient
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var __db: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
    prisma.$connect()
} else {
    if (!global.__db) {
        global.__db = new PrismaClient({
            log:
              process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error']
        })
        global.__db.$connect()
    }
    prisma = global.__db
}

const linkExpirationTime = 1000 * 60 * 30
const sessionExpirationTime = 1000 * 60 * 60 * 24 * 365

export { prisma, linkExpirationTime, sessionExpirationTime}
