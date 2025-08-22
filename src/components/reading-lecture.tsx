"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "./file-uploader";
import { ReadingContent } from "@/types/course-types";



interface ReadingLectureProps {
    content: ReadingContent;
    onContentChange: (content: ReadingContent) => void;
    selectedFile: File | null;
    onFileChange: (file: File | null) => void;
    onFileRemove: () => void;
}

export function ReadingLecture({ content, onContentChange, selectedFile, onFileChange, onFileRemove }: ReadingLectureProps) {
    const handleTypeChange = (readingType: string) => {
        onContentChange({
            readingType: readingType as 'text' | 'link' | 'pdf' | 'video',
            content: ""
        });
    };

    const handleContentUpdate = (newContent: string) => {
        onContentChange({
            ...content,
            content: newContent
        });
    };

    return (
        <>
            <div className="space-y-2">
                <Label>content type</Label>
                <Select value={content.readingType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="max-w-md">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">text</SelectItem>
                        <SelectItem value="link">external link</SelectItem>
                        <SelectItem value="pdf">pdf document</SelectItem>
                        <SelectItem value="video">youtube video</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>content</Label>
                {content.readingType === 'text' ? (
                    <Textarea
                        value={content.content}
                        onChange={(e) => handleContentUpdate(e.target.value)}
                        placeholder="enter lecture content here..."
                        className="text-sm resize-y min-h-[150px]"
                        style={{ resize: 'vertical' }}
                    />
                ) : content.readingType === 'pdf' ? (
                    <FileUploader
                        selectedFile={selectedFile}
                        onFileChange={onFileChange}
                        onRemove={onFileRemove}
                    />
                ) : (
                    <Input
                        value={content.content}
                        onChange={(e) => handleContentUpdate(e.target.value)}
                        placeholder={content.readingType === 'link' ? "https://example.com" : "https://youtube.com/watch?v=..."}
                        type="url"
                    />
                )}
            </div>
        </>
    );
}
