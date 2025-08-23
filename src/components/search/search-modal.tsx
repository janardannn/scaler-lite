"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Search, BookOpen, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course-types";
import { DialogTitle } from "@radix-ui/react-dialog";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [results, setResults] = useState<Course[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setResults([]);
            setHasSearched(false);
            setIsSearching(false);
        } else {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get('/api/courses');
                    setAllCourses(response.data);
                } catch (error) {
                    console.error("Failed to fetch courses for search:", error);
                }
            };
            fetchCourses();
        }
    }, [isOpen]);

    const handleSearch = () => {
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        const filtered = allCourses.filter(course =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            (course.instructor.name && course.instructor.name.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(filtered);
        setIsSearching(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleResultClick = (courseId: string) => {
        router.push(`/courses/${courseId}`);
        onClose();
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
            return () => document.removeEventListener("keydown", handleEscKey);
        }
    }, [isOpen, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle>Search</DialogTitle>
            <DialogContent className="sm:max-w-2xl p-0 gap-0">
                <DialogHeader className="p-4 pb-2">
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search for courses or instructors..."
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
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="max-h-96 overflow-y-auto px-4 pb-4">
                    {!hasSearched ? (
                        <div className="text-center py-12 text-slate-500">
                            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="font-medium text-slate-700 mb-2">Search Scaler Lite</h3>
                            <p className="text-sm">Find your next course or check out an instructor.</p>
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
                            {results.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                    onClick={() => handleResultClick(course.id)}
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-900 truncate">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                                                Course
                                            </span>
                                            {course.instructor.name && (
                                                <>
                                                    <span>•</span>
                                                    <span>{course.instructor.name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No results found for &quot;{query}&quot;</p>
                            <p className="text-sm mt-1">Try different keywords or check your spelling.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}


// const mockResults = [
//     {
//         id: "1",
//         title: "Introduction to Java Programming",
//         type: "Course",
//         instructor: "Dr. Rajesh Kumar",
//         icon: BookOpen,
//     },
//     {
//         id: "2",
//         title: "Object-Oriented Programming Concepts",
//         type: "Lecture",
//         course: "Java Programming",
//         duration: "45 min",
//         icon: Clock,
//     },
//     {
//         id: "3",
//         title: "React Development Fundamentals",
//         type: "Course",
//         instructor: "Sarah Johnson",
//         icon: BookOpen,
//     },
// ];

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