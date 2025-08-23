"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { useState } from "react";

import { UploadButton } from "@/utils/uploadthing";
import { UploadedFileData, UploadFileResult } from "uploadthing/types";

interface CourseDetailsProps {
    title: string;
    description: string;
    bannerImageUrl?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBannerUploadComplete: (res: string) => void;
    onBannerUploadError: (error: Error) => void;
    onBannerRemove: () => void;
    disabled: boolean;
}

export function CourseDetails({
    title,
    description,
    bannerImageUrl,
    onChange,
    onBannerUploadComplete,
    onBannerUploadError,
    onBannerRemove,
    disabled
}: CourseDetailsProps) {

    const [bannerFileName, setBannerFileName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);


    const handleBannerUploadComplete = (file: UploadedFileData[]) => {
        if (file[0]) {
            console.log(file);
            setBannerFileName(file[0].name);
            onBannerUploadComplete(file[0].ufsUrl);
        }
        setIsUploading(false);
    };

    const handleBannerUploadError = (error: Error) => {
        onBannerUploadError(error);
        setIsUploading(false);
    };

    const handleBannerRemove = () => {
        setBannerFileName(""); // Clear filename
        onBannerRemove(); // Call parent handler
    };

    return (
        <div className="grid grid-cols-1 gap-6">
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
                    className="min-h-[80px] resize-y"
                    placeholder="describe what students will learn..."
                />
            </div>

            <div className="space-y-3">
                <Label>course banner image (optional)</Label>

                {bannerImageUrl || bannerFileName ? (
                    <div className="space-y-3">
                        {/* ✅ Show preview if URL exists */}
                        {bannerImageUrl && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                                <img
                                    src={bannerImageUrl}
                                    alt="Course banner"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* ✅ Show filename (not URL) */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center">
                                    <Image className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {bannerFileName || "Banner image"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {isUploading ? 'Uploading...' : 'Image selected'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBannerRemove}
                                disabled={disabled || isUploading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : (

                    <UploadButton
                        endpoint="courseBanner"
                        onClientUploadComplete={handleBannerUploadComplete}
                        onUploadError={handleBannerUploadError}
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
                                            <span>upload banner image</span>
                                        </>
                                    )}
                                </div>
                            ),
                            allowedContent: "Images (PNG, JPG, WEBP) up to 4MB"
                        }}
                    />
                )}
            </div>
        </div>
    );
}
