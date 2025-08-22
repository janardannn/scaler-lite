"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";

interface CourseDetailsProps {
    title: string;
    description: string;
    bannerImage?: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBannerImageChange: (file: File | null) => void;
    disabled: boolean;
}

export function CourseDetails({
    title,
    description,
    bannerImage,
    onChange,
    onBannerImageChange,
    disabled
}: CourseDetailsProps) {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        onBannerImageChange(file);
    };

    const handleRemoveBanner = () => {
        onBannerImageChange(null);
        // reset the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
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
                <Label htmlFor="banner">course banner image (optional)</Label>
                <div className="space-y-3">
                    <input
                        id="banner"
                        type="file"
                        accept="image/*"
                        disabled={disabled}
                        onChange={handleFileChange}
                        className="w-full rounded-md border border-slate-300 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {bannerImage && (
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center">
                                    <Image className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{bannerImage.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {(bannerImage.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveBanner}
                                disabled={disabled}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
