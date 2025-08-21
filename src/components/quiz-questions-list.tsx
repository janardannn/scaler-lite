"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctOption: number;
}

interface QuizQuestionsListProps {
    questions: QuizQuestion[];
    onRemove: (id: string) => void;
}

export function QuizQuestionsList({ questions, onRemove }: QuizQuestionsListProps) {
    if (questions.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="font-medium">quiz questions ({questions.length})</h3>
            {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-slate-900">
                            question {index + 1}: {question.question}
                        </h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(question.id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2 text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${question.correctOption === optIndex
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className={question.correctOption === optIndex ? 'font-medium text-green-800' : ''}>
                                    {option}
                                </span>
                                {question.correctOption === optIndex && (
                                    <span className="text-xs text-green-600">(correct)</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
