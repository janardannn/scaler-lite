"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
    Loader2, AlertTriangle, ArrowLeft, BookOpen,
    PlayCircle, CheckCircle2, FileText, HelpCircle, Lock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Lecture {
    id: string;
    title: string;
    type: 'READING' | 'QUIZ';
    position: number;
    isCompleted: boolean;
}

interface CourseData {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    instructor: { name: string | null };
    lectures: Lecture[];
    isEnrolled: boolean;
}

export default function CourseDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<CourseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth/sign-in');
            return;
        }

        if (courseId) {
            const fetchCourse = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`/api/courses/${courseId}`);
                    setCourse(response.data);
                } catch (err) {
                    setError('Failed to load course details. Please try again later.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCourse();
        }
    }, [session, status, router, courseId]);

    const handleEnroll = async () => {
        setIsEnrolling(true);
        try {
            await axios.post(`/api/courses/${courseId}/enroll`);
            setCourse(prev => prev ? { ...prev, isEnrolled: true } : null);
        } catch (err) {
            setError('Failed to enroll in the course.');
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleStartCourse = () => {
        if (!course) return;
        const firstUncompleted = course.lectures.find(lecture => !lecture.isCompleted);
        const lectureToStart = firstUncompleted || course.lectures[0];
        if (lectureToStart) {
            router.push(`/courses/${course.id}/lectures/${lectureToStart.id}`);
        }
    };

    if (isLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="pt-28 pb-16 px-4 max-w-4xl mx-auto text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-700">An Error Occurred</h2>
                    <p className="text-slate-600 mt-2">{error}</p>
                    <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
                </main>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="pt-28 pb-16 px-4 max-w-4xl mx-auto text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700">Course Not Found</h2>
                    <p className="text-slate-600 mt-2">We couldn&apos;t find the course you were looking for.</p>
                    <Button onClick={() => router.push('/courses')} className="mt-6">Browse Courses</Button>
                </main>
            </div>
        )
    }

    const totalLectures = course.lectures.length;
    const completedCount = course.lectures.filter(l => l.isCompleted).length;
    const progressPercentage = totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-20 pb-16">
                <div className="bg-slate-800 text-white py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 text-slate-300 hover:text-white hover:bg-slate-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to courses
                        </Button>
                        <h1 className="text-4xl font-bold">{course.title}</h1>
                        <p className="text-lg text-slate-300 mt-2 max-w-2xl">{course.description}</p>
                        <p className="text-sm text-slate-400 mt-4">Created by {course.instructor.name || 'Instructor'}</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 -mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                            <ul className="space-y-3">
                                {course.lectures.map((lecture) => (
                                    <li key={lecture.id} className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                                        <div className="flex items-center space-x-3">
                                            {lecture.type === 'READING' ? <FileText className="w-5 h-5 text-slate-500" /> : <HelpCircle className="w-5 h-5 text-slate-500" />}
                                            <span className="font-medium text-slate-800">{lecture.position}. {lecture.title}</span>
                                        </div>
                                        {lecture.isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-slate-400" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
                            <div className="aspect-video relative mb-4">
                                <Image
                                    src={course.imageUrl || '/placeholder.jpg'}
                                    alt={course.title}
                                    fill
                                    unoptimized
                                    className="object-cover rounded-md"
                                />
                            </div>

                            {session?.user?.role === 'STUDENT' && (
                                <>
                                    {course.isEnrolled ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span>Progress</span>
                                                <span className="font-medium">{completedCount}/{totalLectures}</span>
                                            </div>
                                            <Progress value={progressPercentage} />
                                            <Button onClick={handleStartCourse} className="w-full">
                                                <PlayCircle className="w-4 h-4 mr-2" />
                                                {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full">
                                            {isEnrolling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Enroll Now'}
                                        </Button>
                                    )}
                                </>
                            )}
                            {session?.user?.role === 'INSTRUCTOR' && (
                                <p className="text-center text-sm text-slate-500 py-4">Instructors cannot enroll in courses.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}