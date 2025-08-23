import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'STUDENT') {
        return NextResponse.json(
            { message: "Only students can enroll in courses." },
            { status: HttpStatus.UNAUTHORIZED }
        );
    }

    const { courseId } = await params;

    try {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { message: "Already enrolled in this course" },
                { status: HttpStatus.BAD_REQUEST }
            );
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
            },
        });

        return NextResponse.json(enrollment, { status: HttpStatus.CREATED });

    } catch (error) {
        console.error("Failed to enroll in course:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}