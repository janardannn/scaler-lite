import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { HttpStatus } from "@/utils/http-status"


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: HttpStatus.BAD_REQUEST }
            )
        }

        const { name, role } = await request.json()


        // validation

        if (!name || !role) {
            return NextResponse.json(
                { message: "Name and role are required" },
                { status: HttpStatus.BAD_REQUEST }
            )
        }

        if (name.trim().length === 0) {
            return NextResponse.json(
                { message: "Name cannot be empty" },
                { status: HttpStatus.BAD_REQUEST }
            )
        }


        if (!['STUDENT', 'INSTRUCTOR'].includes(role)) {
            return NextResponse.json(
                { message: "Invalid role specified" },
                { status: HttpStatus.BAD_REQUEST }
            )
        }

        // update db
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name.trim(),
                role: role as "STUDENT" | "INSTRUCTOR"
            }
        })


        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image
            },
            status: HttpStatus.OK
        })

    } catch (error) {
        console.error("Profile completion error:", error)

        if (error instanceof Error) {
            if (error.message.includes('Record to update not found')) {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                )
            }
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
