
"use client";

import React, { useState } from 'react';
import { type LessonPlan, type Chapter } from '@/lib/lesson-plan-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Book, Layers3, FlaskConical, Atom, Sigma, Zap, Dna, Trash2 } from 'lucide-react';
import type { Message } from '@/lib/chat-data';

interface LessonPlannerResponseProps {
    plan: LessonPlan;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
    setIsReplying: (isReplying: boolean) => void;
    onSend: (content: string, fileData?: string) => void;
}

const termIcons = [Book, Layers3, FlaskConical];
const monthIcons = [Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar, Calendar]; // Just repeating for now
const chapterIcons = [Sigma, Dna, Zap, Atom, BookOpen, Trash2];

const getChapterIcon = (index: number) => {
    const Icon = chapterIcons[index % chapterIcons.length];
    return <Icon className="h-6 w-6" />;
}

export default function LessonPlannerResponse({ plan, addMessage, setIsReplying, onSend }: LessonPlannerResponseProps) {
    const [selectedTermIndex, setSelectedTermIndex] = useState(0);

    const handleChapterClick = (chapter: Chapter) => {
        onSend(`generate me lesson plan for chapter ${chapter.name} which comes in ${selectedTerm.term_name}`);
    };

    const selectedTerm = plan.terms[selectedTermIndex];

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                    <CardTitle className="text-3xl font-bold text-center">Grade {plan.grade} Curriculum</CardTitle>
                    <p className="text-center text-purple-200 text-sm mt-1">Academic Year {plan.academic_year}</p>
                </div>
                <div className='p-4 bg-gray-50 border-b'>
                    <div className="flex justify-center gap-2">
                        {plan.terms.map((term, index) => {
                            const Icon = termIcons[index % termIcons.length];
                            return (
                                <Button
                                    key={index}
                                    variant={selectedTermIndex === index ? 'default' : 'outline'}
                                    className={cn(
                                        "gap-2 transition-all duration-200",
                                        selectedTermIndex === index 
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                    )}
                                    onClick={() => setSelectedTermIndex(index)}
                                >
                                    <Icon className="h-4 w-4" />
                                    {term.term_name}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 bg-gray-100/50">
                {selectedTerm && (
                    <div className='space-y-6'>
                         <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                             <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600'>
                                {React.createElement(termIcons[selectedTermIndex % termIcons.length], { className: "h-6 w-6"})}
                             </div>
                             <span>{selectedTerm.term_name}</span>
                         </h2>
                        {selectedTerm.months.map((month, monthIndex) => {
                            const MonthIcon = monthIcons[monthIndex % monthIcons.length];
                            return (
                                <div key={monthIndex} className="p-4 bg-white rounded-xl shadow-md">
                                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-700 mb-4">
                                        <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600'>
                                            <MonthIcon className="h-5 w-5" />
                                        </div>
                                        <span>{month.month}</span>
                                    </h3>
                                    <div className="grid gap-4">
                                        {month.chapters.map((chapter, chapterIndex) => (
                                            <button
                                                key={chapterIndex}
                                                onClick={() => handleChapterClick(chapter)}
                                                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition-all duration-200 text-left w-full hover:shadow-lg hover:scale-[1.02]"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                    {getChapterIcon(chapterIndex)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{chapter.name}</p>
                                                    <p className="text-sm text-gray-500">{chapter.topics?.join(', ')}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
