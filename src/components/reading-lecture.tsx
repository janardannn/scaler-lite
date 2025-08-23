"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, Link as LinkIcon } from "lucide-react";
import { ReadingContent } from "@/types/course-types";
import { useState } from "react";


import { UploadButton } from "@/utils/uploadthing";
import { UploadedFileData, UploadFileResult } from "uploadthing/types";

interface ReadingLectureProps {
    content: ReadingContent;
    onContentChange: (content: ReadingContent) => void;
    disabled?: boolean;
}

export function ReadingLecture({ content, onContentChange, disabled }: ReadingLectureProps) {

    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const handleTypeChange = (readingType: string) => {
        onContentChange({
            readingType: readingType as 'text' | 'link' | 'pdf' | 'video',
            content: "",
        });
        // reset filename when type changes
        setSelectedFileName("");
    };

    const handleContentUpdate = (newContent: string) => {
        onContentChange({
            ...content,
            content: newContent
        });
    };

    // ✅ Handle file upload completion
    const handleFileUploadComplete = (file: UploadedFileData[]) => {
        if (file) {

            setSelectedFileName(file[0].name);
            onContentChange({
                ...content,
                content: file[0].ufsUrl,
            });
        }
        setIsUploading(false);
    };

    const handleFileUploadError = (error: Error) => {
        alert(`File upload failed: ${error.message}`);
        setIsUploading(false);
    };

    // ✅ Remove uploaded file
    const handleRemoveFile = () => {
        setSelectedFileName("");
        onContentChange({
            ...content,
            content: "",
        });
    };

    return (
        <>
            <div className="space-y-2">
                <Label>content type</Label>
                <Select value={content.readingType} onValueChange={handleTypeChange} disabled={disabled}>
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
                        disabled={disabled}
                    />
                ) : content.readingType === 'pdf' ? (
                    <div className="space-y-3">
                        {selectedFileName || content.content ? (
                            // ✅ Show filename (not URL)
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {selectedFileName || content.content}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {isUploading ? 'Uploading...' : 'PDF file selected'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                    disabled={disabled || isUploading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (

                            <UploadButton
                                endpoint="lectureAttachment"
                                onClientUploadComplete={handleFileUploadComplete}
                                onUploadError={handleFileUploadError}
                                onUploadBegin={() => setIsUploading(true)}
                                appearance={{
                                    button: "w-full py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors",
                                    container: "w-full",
                                    allowedContent: "text-xs text-slate-500 mt-2"
                                }}
                                content={{
                                    button: (
                                        <div className="flex items-center justify-center space-x-2">
                                            {isUploading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-5 h-5" />
                                                    <span>upload pdf document</span>
                                                </>
                                            )}
                                        </div>
                                    ),
                                    allowedContent: "PDF up to 4MB"
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <Input
                            value={content.content}
                            onChange={(e) => handleContentUpdate(e.target.value)}
                            placeholder={content.readingType === 'link' ? "https://example.com" : "https://youtube.com/watch?v=..."}
                            type="url"
                            disabled={disabled}
                            className="pl-10"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                )}
            </div>
        </>
    );
}
