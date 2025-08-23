import NextAuth, { Session, User, Account, Profile } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "./prisma"

// const prisma = new PrismaClient()

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: {
            user: User,
            account: Account | null,
            profile?: Profile
        }) {
            return true
        },
        session: ({ session, user }: { session: Session, user: User }) => {
            if (session.user) {
                session.user.id = user.id
                session.user.role = user.role
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/sign-in',
        newUser: '/profile/complete',
    },
    events: {
        async signIn({ user, isNewUser }: {
            user: User,
            isNewUser?: boolean
        }) {
            if (isNewUser) {
                console.log(`New user signed up: ${user.email}`)
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }