export interface ReadingContent {
    readingType: 'text' | 'link' | 'pdf' | 'video';
    content: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctOption: number;
}

export interface QuizContent {
    questions: QuizQuestion[];
}


export interface ReadingLecture {
    id: string;
    title: string;
    type: 'reading';
    content: ReadingContent;
}

export interface QuizLecture {
    id: string;
    title: string;
    type: 'quiz';
    content: QuizContent;
}

export interface Lecture {
    id: string;
    title: string;
    type: 'reading' | 'quiz';
    content: QuizContent | ReadingContent;
}

export interface Course {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    instructor: { name: string | null };
    _count: {
        lectures: number;
    };
    progress?: number;
}
