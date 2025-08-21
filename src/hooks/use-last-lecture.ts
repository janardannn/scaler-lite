"use client";

import { useState, useEffect } from 'react';

interface LastLectureData {
    id: string;
    title: string;
    position: number;
    courseId: string;
    courseTitle: string;
}

export function useLastLecture() {
    const [lastLecture, setLastLecture] = useState<LastLectureData | null>(null);

    useEffect(() => {
        // const stored = localStorage.getItem('lastLecture');
        // if (stored) {
        //     try {
        //         setLastLecture(JSON.parse(stored));
        //     } catch (error) {
        //         console.log('Failed to load lastLecture from localStorage:', error);
        //         localStorage.removeItem('lastLecture');
        //     }
        // }
        // setLastLecture(() => {
        //     return {
        //         id: "1",
        //         title: "Introduction to Java Programming",
        //         position: 1,
        //         courseId: "1",
        //         courseTitle: "Introduction to Java Programming"
        //     }
        // })
    }, []);

    const saveLastLecture = (lecture: LastLectureData) => {
        setLastLecture(lecture);
        localStorage.setItem('lastLecture', JSON.stringify(lecture));
    };

    return { lastLecture, saveLastLecture };
}
