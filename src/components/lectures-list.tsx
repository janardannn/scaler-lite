"use client";

import { Button } from "@/components/ui/button";
import { FileText, Link, FileIcon, Video, HelpCircle, Trash2 } from "lucide-react";

interface Lecture {
    id: string;
    title: string;
    type: 'reading' | 'quiz';
    content: any;
}

interface LecturesListProps {
    lectures: Lecture[];
    onRemove: (id: string) => void;
}

export function LecturesList({ lectures, onRemove }: LecturesListProps) {
    if (lectures.length === 0) return null;

    const getReadingTypeIcon = (type: string) => {
        switch (type) {
            case 'text': return <FileText className="w-4 h-4" />;
            case 'link': return <Link className="w-4 h-4" />;
            case 'pdf': return <FileIcon className="w-4 h-4" />;
            case 'video': return <Video className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="font-medium">added lectures ({lectures.length})</h3>
            {lectures.map((lecture, index) => (
                <div key={lecture.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            {lecture.type === 'reading' ?
                                getReadingTypeIcon(lecture.content.readingType) :
                                <HelpCircle className="w-5 h-5 text-primary" />
                            }
                            <div>
                                <span className="font-medium">{lecture.title}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                                        {lecture.type === 'reading' ?
                                            lecture.content.readingType :
                                            `quiz (${lecture.content.questions?.length || 0} questions)`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(lecture.id)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
