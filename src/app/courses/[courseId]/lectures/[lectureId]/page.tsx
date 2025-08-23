"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import {
    Loader2, AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight,
    FileText, HelpCircle, CheckCircle2, XCircle, Link, Video, ThumbsUp
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';


interface Option { id: string; text: string; }
interface Question { id: string; text: string; options: Option[]; }
interface Attachment { id: string; name: string; url: string; }
interface LectureData {
    id: string; title: string; type: 'READING' | 'QUIZ';
    content: string | null; questions: Question[]; attachments: Attachment[];
}
interface PageData {
    courseTitle: string; lecture: LectureData; isCompleted: boolean;
    allLectures: { id: string; title: string; isCompleted: boolean; position: number; }[];
    currentLectureIndex: number;
}


const getYoutubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
};


export default function LecturePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const { courseId, lectureId } = params;

    const [data, setData] = useState<PageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && courseId && lectureId) {
            const fetchLecture = async () => {
                setIsLoading(true);
                setQuizResult(null);
                setSelectedAnswers({});
                try {
                    const res = await axios.get(`/api/courses/${courseId}/lectures/${lectureId}`);
                    setData(res.data);
                } catch (err) {
                    setError('Failed to load lecture.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLecture();
        } else if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [courseId, lectureId, status, router]);

    const handleMarkAsComplete = async () => {
        setIsSubmitting(true);
        try {
            await axios.post(`/api/courses/${courseId}/lectures/${lectureId}/complete`);
            setData(prev => {
                if (!prev) return null;
                const newAllLectures = [...prev.allLectures];
                newAllLectures[prev.currentLectureIndex].isCompleted = true;
                return { ...prev, isCompleted: true, allLectures: newAllLectures };
            });
        } catch (err) {
            setError("Failed to mark as complete.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuizSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await axios.post(`/api/courses/${courseId}/lectures/${lectureId}/submit`, { answers: selectedAnswers });
            setQuizResult(res.data);
            if (res.data.passed) {
                setData(prev => {
                    if (!prev) return null;
                    const newAllLectures = [...prev.allLectures];
                    newAllLectures[prev.currentLectureIndex].isCompleted = true;
                    return { ...prev, isCompleted: true, allLectures: newAllLectures };
                });
            }
        } catch (err) {
            setError("Failed to submit quiz.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToLecture = (offset: number) => {
        if (!data) return;
        const newIndex = data.currentLectureIndex + offset;
        if (newIndex >= 0 && newIndex < data.allLectures.length) {
            const lectureToNavigate = data.allLectures[newIndex];
            router.push(`/courses/${courseId}/lectures/${lectureToNavigate.id}`);
        }
    };

    if (isLoading || status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-2" />
                {error || "Could not load data"}
            </div>
        );
    }

    const { lecture, allLectures, currentLectureIndex, isCompleted } = data;
    const attachment = lecture.attachments[0];
    const readingType = attachment ? attachment.name.split(' - ').pop()?.toLowerCase() : 'text';

    const renderReadingContent = () => {
        switch (readingType) {
            case 'video':
                const embedUrl = getYoutubeEmbedUrl(attachment.url);
                return embedUrl ? <div className="aspect-video"><iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div> : <p>Invalid YouTube URL</p>;
            case 'pdf':
                return <iframe src={attachment.url} className="w-full h-[80vh]" title={attachment.name}></iframe>;
            case 'link':
                return <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-2"><Link className="w-4 h-4" />{attachment.url}</a>;
            default:
                return <p className="text-slate-700 whitespace-pre-wrap">{lecture.content}</p>;
        }
    };

    const isNextDisabled = currentLectureIndex >= allLectures.length - 1 || !isCompleted;

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <header className="bg-white shadow-sm sticky top-[80px] z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center min-w-0">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/courses/${courseId}`)} className="mr-2 hidden sm:inline-flex"><ArrowLeft className="w-4 h-4" /></Button>
                        <div>
                            <p className="text-sm text-slate-500 truncate">{data.courseTitle}</p>
                            <h1 className="text-lg font-semibold truncate">{lecture.title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => goToLecture(-1)} disabled={currentLectureIndex === 0}><ChevronLeft className="w-4 h-4 mr-1" /> Prev</Button>
                        <Button variant="outline" size="sm" onClick={() => goToLecture(1)} disabled={isNextDisabled}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                </div>
            </header>

            <main className="py-8 max-w-4xl mx-auto px-4">
                {lecture.type === 'READING' && (
                    <Card>
                        <CardHeader><CardTitle>{readingType?.charAt(0).toUpperCase() + (readingType?.slice(1) || '')} Content</CardTitle></CardHeader>
                        <CardContent className="prose max-w-none">{renderReadingContent()}</CardContent>
                        {!isCompleted && (
                            <CardContent>
                                <Button onClick={handleMarkAsComplete} disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ThumbsUp className="w-4 h-4 mr-2" />} Mark as Complete
                                </Button>
                            </CardContent>
                        )}
                    </Card>
                )}

                {lecture.type === 'QUIZ' && (
                    <Card>
                        <CardHeader><CardTitle className="flex justify-between items-center"><span>Quiz: {lecture.title}</span> {isCompleted && <span className="text-sm font-medium text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Completed</span>}</CardTitle></CardHeader>
                        <CardContent>
                            {quizResult ? (
                                <div className={`p-4 rounded-md text-center ${quizResult.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                                    {quizResult.passed ? <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" /> : <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />}
                                    <h3 className={`text-xl font-semibold ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>{quizResult.passed ? "Congratulations, you passed!" : "Please try again"}</h3>
                                    <p className="text-3xl font-bold mt-2">{quizResult.score}%</p>
                                    {!quizResult.passed && <Button onClick={() => { setQuizResult(null); setSelectedAnswers({}); }} className="mt-4">Retry Quiz</Button>}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {lecture.questions.map((q, index) => (
                                        <div key={q.id}>
                                            <p className="font-semibold mb-2">{index + 1}. {q.text}</p>
                                            <RadioGroup onValueChange={(value) => setSelectedAnswers(prev => ({ ...prev, [q.id]: value }))}>
                                                {q.options.map(opt => (
                                                    <div key={opt.id} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50"><RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} /><Label htmlFor={`${q.id}-${opt.id}`}>{opt.text}</Label></div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                    <Button onClick={handleQuizSubmit} disabled={isSubmitting || Object.keys(selectedAnswers).length !== lecture.questions.length} className="w-full">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Submit Quiz"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}