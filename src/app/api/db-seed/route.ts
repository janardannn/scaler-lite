
import { NextResponse } from 'next/server';
import { PrismaClient, UserType } from '@/generated/prisma';

const prisma = new PrismaClient();

const courseData = [
    // ... course data 
    {
        title: 'Introduction to Java Programming',
        description: 'Learn Java fundamentals and OOP concepts',
        imageUrl: 'https://file.labex.io/namespace/df87b950-1f37-4316-bc07-6537a1f2c481/java/lab-your-first-java-lab/assets/java.svg',
        instructorName: 'Test Instructor 1',
    },
    {
        title: 'Web Development with React',
        description: 'Build modern web applications',
        imageUrl: 'https://blog.openreplay.com/images/vite-create-react-app/images/hero.png',
        instructorName: 'Test Instructor 2',
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Master DSA for interviews',
        imageUrl: 'https://assets.bytebytego.com/diagrams/0024-10-data-structures-used-in-daily-life.png',
        instructorName: 'Janardan Hazarika',
    },
    {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to ML and AI concepts',
        imageUrl: 'https://prutor.online/wp-content/uploads/2024/08/Machine-Learning.jpg',
        instructorName: 'Test Instructor 3',
    },
    {
        title: 'Python for Beginners',
        description: 'Start your programming journey',
        imageUrl: 'https://files.realpython.com/media/Newbie_Watermarked.a9319218252a.jpg',
        instructorName: 'Test Instructor 4',
    },
    {
        title: 'DevOps End-to-End',
        description: 'Complete devops roadmap covered',
        imageUrl: 'https://shalb.com/wp-content/uploads/2019/11/Devops1.jpeg',
        instructorName: 'Test Instructor 5',
    },
];


export async function GET() {

    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Seeding is disabled in production' }, { status: 403 });
    }

    try {
        console.log('seeding started...');

        console.log('cleaning database...');
        await prisma.progress.deleteMany();
        await prisma.enrollment.deleteMany();
        await prisma.score.deleteMany();
        await prisma.option.deleteMany();
        await prisma.question.deleteMany();
        await prisma.attachment.deleteMany();
        await prisma.lecture.deleteMany();
        await prisma.course.deleteMany();
        await prisma.user.deleteMany();

        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.verificationToken.deleteMany();

        console.log('creating instructors...');
        const instructors = await Promise.all([
            'Janardan Hazarika',
            'Test Instructor 1',
            'Test Instructor 2',
            'Test Instructor 3',
            'Test Instructor 4',
            'Test Instructor 5',
        ].map(name => prisma.user.upsert({
            where: { email: `${name.toLowerCase().replace(/\s+/g, '.')}@cuchd.com` },
            update: {},
            create: {
                name,
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@student.com`,
                role: UserType.INSTRUCTOR,
            },
        })));

        console.log('creating students...');
        const students = await Promise.all([
            'janardan_stu',
            'test_student_1',
            'test_student_2',
        ].map(name => prisma.user.upsert({
            where: { email: `${name}@student.com` },
            update: {},
            create: {
                name,
                email: `${name}@student.com`,
                role: UserType.STUDENT,
            },
        })));

        const instructorMap = new Map(instructors.map(i => [i.name!, i.id]));

        console.log('creating courses and lectures...');
        for (const course of courseData) {
            const newCourse = await prisma.course.create({
                data: {
                    title: course.title,
                    description: course.description,
                    imageUrl: course.imageUrl,
                    instructorId: instructorMap.get(course.instructorName)!,
                    lectures: {
                        create: [
                            ...Array.from({ length: 3 }, (_, i) => ({
                                title: `Chapter ${i + 1}: Reading Material`,
                                position: i + 1,
                                type: 'READING' as const,
                                content: `This is the text content for chapter ${i + 1}.`,
                            })),
                            {
                                title: 'Chapter 4: Quiz',
                                position: 4,
                                type: 'QUIZ' as const,
                                questions: {
                                    create: [
                                        {
                                            text: 'What is the capital of France?',
                                            options: {
                                                create: [
                                                    { text: 'Berlin', isCorrect: false },
                                                    { text: 'Madrid', isCorrect: false },
                                                    { text: 'Paris', isCorrect: true },
                                                    { text: 'Rome', isCorrect: false },
                                                ],
                                            },
                                        },
                                        {
                                            text: 'Which planet is known as the Red Planet?',
                                            options: {
                                                create: [
                                                    { text: 'Earth', isCorrect: false },
                                                    { text: 'Mars', isCorrect: true },
                                                    { text: 'Jupiter', isCorrect: false },
                                                    { text: 'Venus', isCorrect: false },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            });
            console.log(`created course: ${newCourse.title}`);
        }

        console.log('enrolling students...');
        const mainStudent = students.find(s => s.name === 'janardan_stu');
        if (mainStudent) {
            const myCourses = await prisma.course.findMany({
                where: {
                    OR: [
                        { title: 'Introduction to Java Programming' },
                        { title: 'Web Development with React' },
                        { title: 'Data Structures & Algorithms' },
                    ]
                },
                include: { lectures: true }
            });

            for (const course of myCourses) {
                await prisma.enrollment.create({
                    data: {
                        userId: mainStudent.id,
                        courseId: course.id
                    }
                });
                if (course.lectures.length > 0) {
                    await prisma.progress.create({
                        data: {
                            userId: mainStudent.id,
                            lectureId: course.lectures[0].id,
                            isCompleted: true
                        }
                    });
                }
            }
        }

        console.log('seeding finished.');
        return NextResponse.json({ message: 'Database seeded successfully!' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to seed database', error: (error as Error).message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}