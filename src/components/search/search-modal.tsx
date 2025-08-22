"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Clock, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const mockResults = [
    {
        id: "1",
        title: "Introduction to Java Programming",
        type: "Course",
        instructor: "Dr. Rajesh Kumar",
        icon: BookOpen,
    },
    {
        id: "2",
        title: "Object-Oriented Programming Concepts",
        type: "Lecture",
        course: "Java Programming",
        duration: "45 min",
        icon: Clock,
    },
    {
        id: "3",
        title: "React Development Fundamentals",
        type: "Course",
        instructor: "Sarah Johnson",
        icon: BookOpen,
    },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<typeof mockResults>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setHasSearched(false);
            setIsSearching(false);
        }
    }, [isOpen]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        // simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // filter results based on query 
        const filtered = mockResults.filter(result =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            (result.instructor && result.instructor.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(filtered);
        setIsSearching(false);
    };

    // handle enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // handle esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl p-0 gap-0">
                <DialogHeader className="p-4 pb-2">
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search for courses, lectures, instructors..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-10 pr-4 py-3 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                autoFocus
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={!query.trim() || isSearching}
                            className="px-6 py-3 bg-primary hover:bg-primary-hover"
                        >
                            {isSearching ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="max-h-96 overflow-y-auto px-4 pb-4">
                    {!hasSearched ? (

                        <div className="text-center py-12 text-slate-500">
                            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="font-medium text-slate-700 mb-2">Search Scaler Lite</h3>
                            <p className="text-sm">Type your search query and press Enter or click search</p>
                        </div>
                    ) : isSearching ? (

                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                            <p className="text-slate-600">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (

                        <div className="space-y-2">
                            <p className="text-sm text-slate-500 mb-4">
                                Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                            </p>
                            {results.map((result) => {
                                const Icon = result.icon;
                                return (
                                    <div
                                        key={result.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            console.log("Selected:", result.title);
                                            onClose();
                                        }}
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[primary]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-900 truncate">
                                                {result.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                                                    {result.type}
                                                </span>
                                                {result.instructor && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{result.instructor}</span>
                                                    </>
                                                )}
                                                {result.duration && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{result.duration}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (

                        <div className="text-center py-8 text-slate-500">
                            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No results found for &quot;{query}&quot;</p>
                            <p className="text-sm mt-1">Try different keywords or check your spelling</p>
                        </div>
                    )}
                </div>

                {/* {!isSearching && (
                    <div className="border-t px-4 py-3 bg-slate-50">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center space-x-4">
                                <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd> to search</span>
                                <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">ESC</kbd> to close</span>
                            </div>
                            <span>Search powered by Scaler Lite</span>
                        </div>
                    </div>
                )} */}
            </DialogContent>
        </Dialog>
    );
}
