"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CourseDetailsProps {
    title: string;
    description: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled: boolean;
}

export function CourseDetails({ title, description, onChange, disabled }: CourseDetailsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">course title</Label>
                <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder="enter course title"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">course description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    disabled={disabled}
                    rows={4}
                    className="resize-y"
                    placeholder="describe what students will learn..."
                />
            </div>
        </div>
    );
}
