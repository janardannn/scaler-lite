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

    const { lectureId } = await params;
    const userId = session.user.id;

    try {
        await prisma.progress.upsert({
            where: {
                userId_lectureId: {
                    userId,
                    lectureId,
                },
            },
            update: {
                isCompleted: true,
            },
            create: {
                userId,
                lectureId,
                isCompleted: true,
            },
        });

        return NextResponse.json({ message: "Progress updated" }, { status: HttpStatus.OK });

    } catch (error) {
        console.error("Failed to mark lecture as complete:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}