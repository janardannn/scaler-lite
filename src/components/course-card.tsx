import Image from "next/image";
import { Star, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    instructor: string;
    showProgress: boolean;
    variant: "enrolled" | "discovery";

    progress?: number;
    totalLectures?: number;
    completedLectures?: number;
    enrolledCount?: number;
}

export function CourseCard({
    title,
    description,
    imageUrl,
    instructor,
    showProgress,
    variant,
    progress = 0,
    totalLectures = 0,
    completedLectures = 0,
    enrolledCount = 0,
}: CourseCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
            {/* Course Image */}
            <div className="aspect-video relative overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center text-sm text-slate-500 mb-3">
                    <span>by {instructor}</span>
                </div>


                {showProgress && variant === "enrolled" && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium text-slate-900">
                                {completedLectures}/{totalLectures} lectures
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-teal-600 font-medium">
                            {progress}% complete
                        </div>
                    </div>
                )}


                {variant === "discovery" && (
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{enrolledCount.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Self-paced</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
