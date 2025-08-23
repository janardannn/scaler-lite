"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

interface QuizQuestionProps {
    question: string;
    options: string[];
    correctOption: number;
    onQuestionChange: (question: string) => void;
    onOptionChange: (index: number, value: string) => void;
    onCorrectOptionChange: (index: number) => void;
    onAddQuestion: () => void;
}

export function QuizQuestion({
    question,
    options,
    correctOption,
    onQuestionChange,
    onOptionChange,
    onCorrectOptionChange,
    onAddQuestion
}: QuizQuestionProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>question</Label>
                <Textarea
                    value={question}
                    onChange={(e) => onQuestionChange(e.target.value)}
                    placeholder="enter your quiz question..."
                    rows={3}
                    className="resize-none"
                />
            </div>

            <div className="space-y-4">
                <Label>answer options</Label>
                <RadioGroup
                    value={correctOption.toString()}
                    onValueChange={(value) => onCorrectOptionChange(parseInt(value))}
                    className="space-y-3"
                >
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value={index.toString()} id={`current-option-${index}`} />
                            <Label htmlFor={`current-option-${index}`} className="text-sm font-medium text-slate-700 min-w-[80px]">
                                option {String.fromCharCode(65 + index)}
                            </Label>
                            <Input
                                value={option}
                                onChange={(e) => onOptionChange(index, e.target.value)}
                                placeholder={`enter option ${String.fromCharCode(65 + index)}`}
                                className="flex-1"
                            />
                        </div>
                    ))}
                </RadioGroup>

            </div>

            <Button
                onClick={onAddQuestion}
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary"
                variant="outline"
            >
                <Plus className="w-4 h-4 mr-2" />
                add question to quiz
            </Button>
        </div>
    );
}
