import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string; lectureId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: HttpStatus.UNAUTHORIZED }
        );
    }

    const { courseId, lectureId } = await params;
    const userId = session.user.id;

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lectures: {
                    orderBy: { position: 'asc' },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { message: "Course not found" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
            include: {
                questions: {
                    include: {
                        options: {
                            select: { id: true, text: true },
                        },
                    },
                },
                attachments: true,
            },
        });

        if (!lecture) {
            return NextResponse.json(
                { message: "Lecture not found" },
                { status: HttpStatus.NOT_FOUND }
            );
        }

        const progress = await prisma.progress.findFirst({
            where: { userId, lectureId },
        });

        const lecturesWithCompletion = await Promise.all(
            course.lectures.map(async (lec) => {
                const p = await prisma.progress.findFirst({
                    where: { userId, lectureId: lec.id, isCompleted: true },
                });
                return { ...lec, isCompleted: !!p };
            })
        );

        const currentLectureIndex = lecturesWithCompletion.findIndex(l => l.id === lectureId);

        const responseData = {
            courseTitle: course.title,
            lecture,
            isCompleted: !!progress?.isCompleted,
            allLectures: lecturesWithCompletion,
            currentLectureIndex
        };

        return NextResponse.json(responseData, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to fetch lecture:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}