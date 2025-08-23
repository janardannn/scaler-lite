"use client";

import axios from 'axios';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import { ArrowLeft, BookOpen, Loader2, Plus } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseDetails } from "@/components/course-details";
import { ReadingLecture } from "@/components/reading-lecture";
import { QuizQuestion } from "@/components/quiz-question";
import { QuizQuestionsList } from "@/components/quiz-questions-list";
import { LecturesList } from "@/components/lectures-list";
import { Lecture, QuizQuestion as QuizQuestionType, QuizContent, ReadingContent } from '@/types/course-types';


export default function CreateCoursePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);


    const [formData, setFormData] = useState({ title: "", description: "" });
    const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [currentLecture, setCurrentLecture] = useState<Partial<Lecture>>({
        title: "",
        type: 'reading',
        content: { readingType: 'text', content: "", contentUrl: "" } as ReadingContent
    });
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestionType[]>([]);
    const [currentQuizQuestion, setCurrentQuizQuestion] = useState({
        question: "",
        options: ["", "", "", ""],
        correctOption: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/auth/sign-in');
            return;
        }

        if (session.user.role !== 'INSTRUCTOR') {
            router.push('/');
        }

        setIsLoading(false);
    }, [session, status, router]);

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };


    const handleBannerUploadComplete = (fileUrl: string) => {
        if (fileUrl) {
            setBannerImageUrl(fileUrl);
        }
    };

    const handleBannerUploadError = (error: Error) => {
        setError(`Banner upload failed: ${error.message}`);
    };

    const handleLectureTypeChange = (type: 'reading' | 'quiz') => {
        setCurrentLecture(prev => ({
            ...prev,
            type,
            content: type === 'reading'
                ? { readingType: 'text', content: "", contentUrl: "" } as ReadingContent
                : { questions: [] } as QuizContent
        }));

        if (type === 'quiz') {
            setQuizQuestions([]);
            setCurrentQuizQuestion({ question: "", options: ["", "", "", ""], correctOption: 0 });
        }
    };

    const handleReadingContentChange = (content: ReadingContent) => {
        setCurrentLecture(prev => ({ ...prev, content }));
    };

    const addQuizQuestion = () => {
        if (!currentQuizQuestion.question.trim()) {
            setError("quiz question is required");
            return;
        }

        if (currentQuizQuestion.options.some(opt => !opt.trim())) {
            setError("all quiz options are required");
            return;
        }

        const newQuestion: QuizQuestionType = {
            id: Date.now().toString(),
            question: currentQuizQuestion.question.trim(),
            options: currentQuizQuestion.options.map(opt => opt.trim()),
            correctOption: currentQuizQuestion.correctOption
        };

        setQuizQuestions(prev => [...prev, newQuestion]);
        setCurrentQuizQuestion({ question: "", options: ["", "", "", ""], correctOption: 0 });
        setError(null);
    };

    const removeQuizQuestion = (id: string) => {
        setQuizQuestions(prev => prev.filter(q => q.id !== id));
    };

    const addLecture = () => {
        if (!currentLecture.title?.trim()) {
            setError("lecture title is required");
            return;
        }

        if (currentLecture.type === 'reading') {
            const content = currentLecture.content as ReadingContent;
            if (!content.content?.trim() && content.readingType !== 'text') {
                setError("lecture content is required");
                return;
            }
        }

        if (currentLecture.type === 'quiz' && quizQuestions.length === 0) {
            setError("at least one quiz question is required");
            return;
        }

        const newLecture: Lecture = {
            ...currentLecture,
            id: Date.now().toString(),
            content: currentLecture.type === 'quiz'
                ? { questions: quizQuestions } as QuizContent
                : currentLecture.content!
        } as Lecture;

        setLectures(prev => [...prev, newLecture]);

        setCurrentLecture({
            title: "",
            type: 'reading',
            content: { readingType: 'text', content: "", contentUrl: "" } as ReadingContent
        });

        setQuizQuestions([]);
        setCurrentQuizQuestion({ question: "", options: ["", "", "", ""], correctOption: 0 });
        setError(null);
    };

    const removeLecture = (id: string) => {
        setLectures(prev => prev.filter(lecture => lecture.id !== id));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("course title is required");
            return false;
        }
        if (!formData.description.trim()) {
            setError("course description is required");
            return false;
        }
        if (lectures.length === 0) {
            setError("at least one lecture is required");
            return false;
        }
        return true;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const courseData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                bannerImageUrl,
                lectures: lectures,
            };
            console.log(courseData)
            await axios.post("/api/courses", courseData, {
                headers: { 'Content-Type': 'application/json' }
            });

            router.push("/courses/my-courses");

        } catch (err) {
            let errorMessage = "An unexpected error occurred. Please try again.";

            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.message || "Failed to create the course.";
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="text-slate-600 hover:text-slate-900"
                            disabled={isSubmitting}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            back
                        </Button>
                        <div className="w-px h-6 bg-slate-300" />
                        <h1 className="text-xl font-semibold text-slate-900">create new course</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span>course details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <CourseDetails
                            title={formData.title}
                            description={formData.description}
                            bannerImageUrl={bannerImageUrl}
                            onChange={handleInputChange}
                            onBannerUploadComplete={handleBannerUploadComplete}
                            onBannerUploadError={handleBannerUploadError}
                            onBannerRemove={() => setBannerImageUrl("")}
                            disabled={isSubmitting}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Plus className="w-5 h-5 text-primary" />
                            <span>add lecture</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>lecture title</Label>
                                <Input
                                    value={currentLecture.title || ""}
                                    onChange={(e) => setCurrentLecture(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="enter lecture title"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>lecture type</Label>
                                <Select
                                    value={currentLecture.type}
                                    onValueChange={handleLectureTypeChange}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reading">reading material</SelectItem>
                                        <SelectItem value="quiz">quiz</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {currentLecture.type === 'reading' && (
                            <ReadingLecture
                                content={currentLecture.content as ReadingContent}
                                onContentChange={handleReadingContentChange}
                                disabled={isSubmitting}
                            />
                        )}

                        {currentLecture.type === 'quiz' && (
                            <>
                                <Card className="border-2 border-dashed border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center space-x-2">
                                            <Plus className="w-5 h-5" />
                                            <span>add quiz question</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <QuizQuestion
                                            question={currentQuizQuestion.question}
                                            options={currentQuizQuestion.options}
                                            correctOption={currentQuizQuestion.correctOption}
                                            onQuestionChange={(question) => setCurrentQuizQuestion(prev => ({ ...prev, question }))}
                                            onOptionChange={(index, value) => setCurrentQuizQuestion(prev => ({
                                                ...prev,
                                                options: prev.options.map((opt, i) => i === index ? value : opt)
                                            }))}
                                            onCorrectOptionChange={(index) => setCurrentQuizQuestion(prev => ({ ...prev, correctOption: index }))}
                                            onAddQuestion={addQuizQuestion}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <QuizQuestionsList
                                            questions={quizQuestions}
                                            onRemove={removeQuizQuestion}
                                        />
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        <Button
                            onClick={addLecture}
                            className="w-full bg-primary hover:bg-primary-hover"
                            disabled={isSubmitting}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            add lecture
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <LecturesList lectures={lectures} onRemove={removeLecture} />
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || lectures.length === 0 || !formData.title.trim() || !formData.description.trim()}
                        className="bg-primary hover:bg-primary-hover"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                publishing...
                            </>
                        ) : (
                            "publish course"
                        )}
                    </Button>
                </div>
            </main>
        </div>
    );
}
