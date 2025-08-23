import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HttpStatus } from "@/utils/http-status";

export async function POST(request: NextRequest, { params }: { params: Promise<{ lectureId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: HttpStatus.UNAUTHORIZED });
    }

    const userId = session.user.id;
    const { lectureId } = await params;
    const { answers } = await request.json();

    try {
        const questions = await prisma.question.findMany({
            where: { lectureId },
            include: { options: true },
        });

        if (questions.length === 0) {
            return NextResponse.json({ message: "No questions found for this quiz" }, { status: HttpStatus.NOT_FOUND });
        }

        let correctAnswers = 0;
        questions.forEach(q => {
            const correctOption = q.options.find(opt => opt.isCorrect);
            if (correctOption && answers[q.id] === correctOption.id) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / questions.length) * 100);
        const passed = score >= 70;


        await prisma.score.upsert({
            where: { userId_lectureId: { userId, lectureId } },
            update: { score, maxScore: 100, attempts: { increment: 1 } },
            create: { userId, lectureId, score, maxScore: 100, attempts: 1 }
        });


        if (passed) {
            await prisma.progress.upsert({
                where: { userId_lectureId: { userId, lectureId } },
                update: { isCompleted: true },
                create: { userId, lectureId, isCompleted: true }
            });
        }

        return NextResponse.json({ score, passed }, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to submit quiz:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}