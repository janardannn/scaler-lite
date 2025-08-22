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
