"use client";

import React, { useState } from 'react';
import { type LessonPlan, type Chapter } from '@/lib/lesson-plan-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Book, Layers3, FlaskConical, Atom, Sigma, Zap, Dna, Trash2, Download } from 'lucide-react';
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
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleChapterClick = (chapter: Chapter) => {
        onSend(`generate me lesson plan for chapter ${chapter.name} which comes in ${selectedTerm.term_name}`);
    };

    const handleDownload = async () => {
        setIsGeneratingPDF(true);
        
        try {
            // Create PDF content in a new window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to download PDF');
                return;
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Grade ${plan.grade} Curriculum - Academic Year ${plan.academic_year}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: Arial, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            padding: 20px;
                            background: white;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 3px solid #8B5CF6; 
                            padding-bottom: 20px; 
                        }
                        .header h1 { 
                            color: #8B5CF6; 
                            margin-bottom: 10px; 
                            font-size: 32px; 
                        }
                        .header p { 
                            color: #6B7280; 
                            font-size: 16px; 
                        }
                        .term-section { 
                            margin-bottom: 35px; 
                            break-inside: avoid;
                        }
                        .term-header { 
                            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                            color: white;
                            padding: 15px 20px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                        }
                        .term-header h2 { 
                            font-size: 24px; 
                            margin: 0;
                        }
                        .month { 
                            margin-bottom: 25px; 
                            border: 1px solid #E5E7EB; 
                            border-radius: 12px; 
                            padding: 20px;
                            background: white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .month h3 { 
                            color: #374151; 
                            margin-bottom: 15px; 
                            font-size: 20px;
                            padding-bottom: 8px;
                            border-bottom: 2px solid #F3F4F6;
                        }
                        .chapters-grid { 
                            display: grid; 
                            gap: 12px; 
                        }
                        .chapter { 
                            display: flex; 
                            align-items: flex-start; 
                            gap: 15px; 
                            padding: 15px; 
                            background-color: #F9FAFB; 
                            border: 1px solid #E5E7EB;
                            border-radius: 8px; 
                            break-inside: avoid;
                        }
                        .chapter-icon { 
                            width: 40px; 
                            height: 40px; 
                            background: #DBEAFE; 
                            border-radius: 8px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: #3B82F6;
                            font-weight: bold;
                            flex-shrink: 0;
                        }
                        .chapter-content h4 { 
                            color: #1F2937; 
                            margin-bottom: 5px; 
                            font-size: 16px;
                            font-weight: 600;
                        }
                        .chapter-topics { 
                            color: #6B7280; 
                            font-size: 14px; 
                            line-height: 1.4;
                        }
                        @media print {
                            body { margin: 0; padding: 15px; }
                            .term-section { page-break-inside: avoid; }
                            .month { page-break-inside: avoid; margin-bottom: 20px; }
                            .chapter { page-break-inside: avoid; }
                            .header { margin-bottom: 25px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Grade ${plan.grade} Curriculum</h1>
                        <p>Academic Year ${plan.academic_year}</p>
                    </div>

                    ${plan.terms.map((term, termIndex) => `
                        <div class="term-section">
                            <div class="term-header">
                                <h2>${term.term_name}</h2>
                            </div>
                            
                            ${term.months.map((month, monthIndex) => `
                                <div class="month">
                                    <h3>${month.month}</h3>
                                    <div class="chapters-grid">
                                        ${month.chapters.map((chapter, chapterIndex) => `
                                            <div class="chapter">
                                                <div class="chapter-icon">
                                                    ${chapterIndex + 1}
                                                </div>
                                                <div class="chapter-content">
                                                    <h4>${chapter.name}</h4>
                                                    ${chapter.topics ? `
                                                        <div class="chapter-topics">
                                                            Topics: ${chapter.topics.join(', ')}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </body>
                </html>
            `;

            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            // Wait for content to load
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const selectedTerm = plan.terms[selectedTermIndex];

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white relative">
                    <CardTitle className="text-3xl font-bold text-center">Grade {plan.grade} Curriculum</CardTitle>
                    <p className="text-center text-purple-200 text-sm mt-1">Academic Year {plan.academic_year}</p>
                    <Button
                        onClick={handleDownload}
                        disabled={isGeneratingPDF}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm disabled:opacity-50"
                        variant="outline"
                        size="sm"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isGeneratingPDF ? 'Opening...' : 'Print PDF'}
                    </Button>
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