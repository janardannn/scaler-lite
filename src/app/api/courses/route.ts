import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Lecture, LectureData, QuizContent, QuizQuestion } from "@/types/course-types"

export async function GET(request: NextRequest) {
    try {
        const courses = await prisma.course.findMany({
            where: {
            },
            include: {
                instructor: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        lectures: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(courses, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'INSTRUCTOR') {
        return NextResponse.json({ message: "Unauthorized" }, { status: HttpStatus.UNAUTHORIZED });
    }

    try {
        const { title, description, bannerImageUrl, lectures } = await request.json();
        console.log(title, description, bannerImageUrl, lectures);
        if (!title || !description || !lectures || lectures.length === 0) {
            return NextResponse.json({ message: "Missing required fields" }, { status: HttpStatus.BAD_REQUEST });
        }

        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                imageUrl: bannerImageUrl,
                instructorId: session.user.id,
                lectures: {
                    create: lectures.map((lecture: Lecture, index: number) => {
                        const lectureData: LectureData = {
                            title: lecture.title,
                            position: index + 1,
                            type: lecture.type.toUpperCase() as 'READING' | 'QUIZ',
                        };

                        if (lecture.type === 'reading') {
                            const readingContent = lecture.content as { readingType: string; content: string };


                            if (readingContent.readingType === 'text') {
                                lectureData.content = readingContent.content;
                            } else {
                                // for PDF, video, or link, create an attachment
                                lectureData.attachments = {
                                    create: [
                                        {
                                            name: `${lecture.title} - ${readingContent.readingType}`,
                                            url: readingContent.content,
                                        },
                                    ],
                                };
                            }
                        } else if (lecture.type === 'quiz') {
                            lectureData.questions = {
                                create: (lecture.content as QuizContent).questions.map((q: QuizQuestion) => ({
                                    text: q.question,
                                    options: {
                                        create: q.options.map((opt: string, optIndex: number) => ({
                                            text: opt,
                                            isCorrect: optIndex === q.correctOption,
                                        })),
                                    },
                                })),
                            };
                        }

                        return lectureData;
                    }),
                },
            },
            include: {
                lectures: {
                    include: {
                        attachments: true,
                        questions: {
                            include: {
                                options: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(newCourse, { status: HttpStatus.CREATED });

    } catch (error) {
        console.error("Failed to create course:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}