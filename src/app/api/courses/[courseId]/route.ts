import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: HttpStatus.UNAUTHORIZED }
        );
    }

    const { courseId } = await params;
    const userId = session.user.id;

    if (!courseId) {
        return NextResponse.json(
            { message: "Course ID is required" },
            { status: HttpStatus.BAD_REQUEST }
        );
    }

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: { select: { name: true } },
                lectures: {
                    orderBy: { position: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        position: true,
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        const completedLectures = await prisma.progress.findMany({
            where: {
                userId,
                lectureId: { in: course.lectures.map(l => l.id) },
                isCompleted: true,
            },
            select: { lectureId: true },
        });

        const completedLectureIds = new Set(completedLectures.map(p => p.lectureId));

        const lecturesWithCompletion = course.lectures.map(lecture => ({
            ...lecture,
            isCompleted: completedLectureIds.has(lecture.id),
        }));

        const responseData = {
            ...course,
            lectures: lecturesWithCompletion,
            isEnrolled: !!enrollment,
        };

        return NextResponse.json(responseData, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to fetch course details:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}