"use client";

import { ArrowRight, Play, PlusCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLastLecture } from "@/hooks/use-last-lecture";
import { getDisplayName } from "@/utils/get-display-name";

interface HeroProps {
    user: {
        name: string;
        type: string;
        username: string;
        email: string;
    };
}

export function Hero({ user }: HeroProps) {
    const { lastLecture } = useLastLecture();

    return (
        <section className="mb-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Welcome back, {getDisplayName(user.name, user.username)}! 👋
                </h1>
                <p className="text-lg text-slate-600">
                    {user.type === 'instructor'
                        ? "Ready to inspire and educate?"
                        : "Ready to continue your learning journey?"
                    }
                </p>
            </div>

            {user.type === 'instructor' ? (
                // INSTRUCTOR : create new course card
                <Card className="bg-gradient-to-r from-primary-light to-blue-50 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                                    <PlusCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        Create New Course
                                    </h3>
                                    <p className="text-slate-600 mb-2">
                                        Share your knowledge with students worldwide
                                    </p>
                                    <div className="flex items-center text-sm text-primary">
                                        <span>Build engaging course content</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="bg-primary hover:bg-primary-hover text-white"
                                onClick={() => window.location.href = '/instructor/courses/create'}
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : lastLecture ? (
                // STUDENT: continue learning card
                <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                                    <Play className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        Pick up where you left off
                                    </h3>
                                    <p className="text-slate-600 mb-2">
                                        {lastLecture.courseTitle}
                                    </p>
                                    <div className="flex items-center text-sm text-primary">
                                        <span>Lecture {lastLecture.position}: {lastLecture.title}</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="bg-primary hover:bg-primary-hover text-white"
                                onClick={() => window.location.href = `/courses/${lastLecture.courseId}/lectures/${lastLecture.id}`}
                            >
                                Continue Learning
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (

                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        Start your learning journey
                                    </h3>
                                    <p className="text-slate-600 mb-2">
                                        Explore courses and begin building new skills
                                    </p>
                                    <div className="flex items-center text-sm text-blue-600">
                                        <span>Browse from hundreds of courses</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => window.location.href = '/courses'}
                            >
                                Browse Courses
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
