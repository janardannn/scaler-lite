import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: HttpStatus.UNAUTHORIZED }
        );
    }

    const { id, role } = session.user;

    try {
        let courses;

        if (role === 'INSTRUCTOR') {
            courses = await prisma.course.findMany({
                where: { instructorId: id },
                include: {
                    instructor: { select: { name: true } },
                    _count: { select: { lectures: true } }
                },
                orderBy: { createdAt: 'desc' },
            });
        } else if (role === 'STUDENT') {
            const enrollments = await prisma.enrollment.findMany({
                where: { userId: id },
                include: {
                    course: {
                        include: {
                            instructor: { select: { name: true } },
                            lectures: { select: { id: true } },
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const coursePromises = enrollments.map(async (enrollment) => {
                const totalLectures = enrollment.course.lectures.length;
                const completedLectures = await prisma.progress.count({
                    where: {
                        userId: id,
                        lectureId: { in: enrollment.course.lectures.map(l => l.id) },
                        isCompleted: true,
                    },
                });

                const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

                return {
                    ...enrollment.course,
                    _count: { lectures: totalLectures },
                    completedLectures,
                    progress,
                };
            });

            courses = await Promise.all(coursePromises);
        } else {
            return NextResponse.json(
                { message: "Invalid user role" },
                { status: HttpStatus.FORBIDDEN }
            );
        }

        return NextResponse.json(courses, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to fetch user-specific courses:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}