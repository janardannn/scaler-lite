"use client";

import { Upload, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
    selectedFile: File | null;
    onFileChange: (file: File | null) => void;
    onRemove: () => void;
}

export function FileUploader({ selectedFile, onFileChange, onRemove }: FileUploaderProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            onFileChange(file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">upload pdf document</p>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-upload"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                    >
                        choose pdf file
                    </Button>
                </div>
            </div>
            {selectedFile && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <FileIcon className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                        <p className="font-medium text-green-800">{selectedFile.name}</p>
                        <p className="text-sm text-green-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} mb
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-green-600 hover:text-green-700"
                    >
                        remove
                    </Button>
                </div>
            )}
        </div>
    );
}
