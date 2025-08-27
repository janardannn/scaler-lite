import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "STUDENT" | "INSTRUCTOR"
            profileComplete: boolean
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: "STUDENT" | "INSTRUCTOR"
        profileComplete: boolean
    }
}
