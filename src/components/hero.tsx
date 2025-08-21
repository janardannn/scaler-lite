"use client";

import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLastLecture } from "@/hooks/use-last-lecture";

interface HeroProps {
    userName: string;
}

export function Hero({ userName }: HeroProps) {
    const { lastLecture } = useLastLecture();


    return (
        <section className="mb-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Welcome back, {userName}! 👋
                </h1>
                <p className="text-lg text-slate-600">
                    Ready to continue your learning journey?
                </p>
            </div>


            {lastLecture && <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center">
                                <Play className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">
                                    Pick up where you left off
                                </h3>
                                <p className="text-slate-600 mb-2">
                                    Introduction to Java Programming
                                </p>
                                <div className="flex items-center text-sm text-teal-600">
                                    <span>Lecture 9: Object-Oriented Programming</span>
                                </div>
                            </div>
                        </div>
                        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                            Continue Learning
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            }
        </section>
    );
}
