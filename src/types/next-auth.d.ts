import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "STUDENT" | "INSTRUCTOR"
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: "STUDENT" | "INSTRUCTOR"
    }
}
