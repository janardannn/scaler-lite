"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PlusCircle, Loader2, AlertTriangle, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { Navbar } from '@/components/navbar';
import { Course } from '@/types/course-types';



export default function MyCoursesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageTitle, setPageTitle] = useState("My Courses");

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/sign-in');
            return;
        }


        if (session.user.role === 'INSTRUCTOR') {
            setPageTitle("My Created Courses");
        } else {
            setPageTitle("My Enrolled Courses");
        }

        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses/my-courses');
                setCourses(response.data);
            } catch (err) {
                setError('Failed to load your courses. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [session, status, router]);


    const user = session?.user ? {
        name: session.user.name || "User",
        type: session.user.role?.toUpperCase() || "STUDENT"
    } : null;

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="w-px h-6 bg-slate-300" />
                        <h1 className="text-2xl font-semibold text-slate-900">{pageTitle}</h1>
                    </div>


                    {user.type === 'INSTRUCTOR' && (
                        <Button onClick={() => router.push('/instructor/courses/create')}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create New Course
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {!isLoading && !error && courses.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-medium text-slate-700">No courses found</h3>
                        <p className="text-slate-500 mt-2 mb-4">
                            {user.type === 'INSTRUCTOR'
                                ? 'Click "Create New Course" to get started.'
                                : 'Enroll in a course to see it here.'
                            }
                        </p>
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.description || ""}
                            imageUrl={course.imageUrl || "/placeholder.jpg"}

                            instructor={course.instructor?.name || user.name || "Instructor"}

                            variant={user.type === 'STUDENT' ? 'enrolled' : 'discovery'}
                            showProgress={user.type === 'STUDENT'}

                            totalLectures={course._count.lectures}
                            progress={course.progress}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}