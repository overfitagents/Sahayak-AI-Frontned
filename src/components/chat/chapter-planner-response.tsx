"use client";

import React, { useRef, useState } from 'react';
import type { Chapter, LessonBreakdown, DifferentiationSupport, Section } from '@/lib/lesson-plan-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from '../ui/badge';
import { BookOpen, Target, Lightbulb, Activity, CheckSquare, Clock, Users, Brain, Rocket, ListChecks, ArrowRight, BookCopy, Zap, GitBranch, Milestone, Book, Tag, Goal } from 'lucide-react';
import { Button } from '../ui/button';

interface ChapterPlannerResponseProps {
    chapter: Chapter;
}

const InfoCard = ({ label, value, icon }: { label: string, value: React.ReactNode, icon?: React.ReactNode }) => (
    <div>
        <p className="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </p>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-base">
            {value}
        </div>
    </div>
);

const PointList = ({ items, icon }: { items: string[], icon: React.ReactNode }) => (
    <ul className="space-y-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">{icon}</span>
                <span className="flex-1 text-gray-700">{item}</span>
            </li>
        ))}
    </ul>
);

const SectionDisplay = ({ section }: { section: Section }) => (
    <div className="p-4 rounded-lg bg-white border border-gray-200/80">
        <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><ListChecks className="text-purple-500" /> {section.title}</h4>
            <Badge variant="outline" className="border-purple-400/50 text-purple-600 bg-purple-50">
                {section.time}
            </Badge>
        </div>
        <div className="space-y-4 text-gray-600">
            {section.points.length > 0 && (
                <div>
                    <h5 className="font-bold mb-2 text-gray-600">Key Points:</h5>
                    <PointList items={section.points} icon={<ArrowRight size={16}/>} />
                </div>
            )}
            {section.activities.length > 0 && (
                <div>
                     <h5 className="font-bold mb-2 text-gray-600">Activities:</h5>
                    <PointList items={section.activities} icon={<Zap size={16}/>} />
                </div>
            )}
        </div>
    </div>
);

export default function ChapterPlannerResponse({ chapter }: ChapterPlannerResponseProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleDownload = async () => {
        setIsGeneratingPDF(true);
        
        try {
            // Create PDF content in a new window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to download PDF');
                return;
            }

            const learningGoalsArray = chapter.overview.learningGoals.split(/\d+\.\s?/).filter(Boolean);

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${chapter.chapterTitle} - Lesson Plan</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: Arial, sans-serif; 
                            line-height: 1.5; 
                            color: #333; 
                            padding: 15px;
                            background: white;
                            margin: 0;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 20px; 
                            border-bottom: 2px solid #8B5CF6; 
                            padding-bottom: 15px; 
                        }
                        .header h1 { 
                            color: #8B5CF6; 
                            margin-bottom: 8px; 
                            font-size: 26px; 
                        }
                        .header-info { 
                            display: flex; 
                            justify-content: center; 
                            gap: 20px; 
                            flex-wrap: wrap; 
                        }
                        .section { margin-bottom: 20px; }
                        .section h2 { 
                            color: #8B5CF6; 
                            border-bottom: 1px solid #E5E7EB; 
                            padding-bottom: 3px; 
                            margin-bottom: 12px; 
                        }
                        .period { 
                            margin-bottom: 20px; 
                            border: 1px solid #E5E7EB; 
                            border-radius: 8px; 
                            padding: 15px; 
                        }
                        .period h3 { 
                            color: #374151; 
                            margin-bottom: 10px; 
                        }
                        .period-time { 
                            color: #6B7280; 
                            font-weight: normal; 
                        }
                        .lesson-section { 
                            margin-bottom: 15px; 
                            padding: 10px; 
                            background-color: #F9FAFB; 
                            border-radius: 6px; 
                        }
                        .lesson-section h4 { 
                            color: #374151; 
                            margin-bottom: 8px; 
                        }
                        .section-time { 
                            color: #6B7280; 
                            font-size: 14px; 
                        }
                        .content-block { margin-bottom: 10px; }
                        .content-block strong { color: #6B7280; }
                        ul { margin: 5px 0 0 20px; }
                        li { margin-bottom: 3px; }
                        .wrap-up { 
                            background-color: #EDE9FE; 
                            padding: 10px; 
                            border-radius: 6px; 
                            margin-top: 10px; 
                        }
                        .wrap-up strong { color: #8B5CF6; }
                        .diff-grid { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 15px; 
                            margin-top: 15px; 
                        }
                        .diff-struggling { 
                            border: 1px solid #FCA5A5; 
                            border-radius: 8px; 
                            padding: 15px; 
                            background-color: #FEF2F2; 
                        }
                        .diff-struggling h3 { color: #DC2626; margin-bottom: 10px; }
                        .diff-advanced { 
                            border: 1px solid #86EFAC; 
                            border-radius: 8px; 
                            padding: 15px; 
                            background-color: #F0FDF4; 
                        }
                        .diff-advanced h3 { color: #16A34A; margin-bottom: 10px; }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .diff-grid { 
                                display: block; 
                            }
                            .diff-struggling, .diff-advanced { 
                                margin-bottom: 15px; 
                                break-inside: avoid;
                            }
                            .period { break-inside: avoid; }
                            .header { margin-bottom: 15px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${chapter.chapterTitle}</h1>
                        <div class="header-info">
                            <span><strong>Class:</strong> ${chapter.overview.class}</span>
                            <span><strong>Subject:</strong> ${chapter.overview.subject}</span>
                            <span><strong>Time:</strong> ${chapter.overview.timeAllotment}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>Learning Goals</h2>
                        <ul>
                            ${learningGoalsArray.map(goal => `<li>${goal.trim()}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Lesson Breakdown</h2>
                        ${chapter.lessonBreakdown.map(period => `
                            <div class="period">
                                <h3>${period.periodName} <span class="period-time">(${period.periodTime})</span></h3>
                                ${period.sections.map(section => `
                                    <div class="lesson-section">
                                        <h4>${section.title} <span class="section-time">(${section.time})</span></h4>
                                        ${section.points.length > 0 ? `
                                            <div class="content-block">
                                                <strong>Key Points:</strong>
                                                <ul>
                                                    ${section.points.map(point => `<li>${point}</li>`).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                        ${section.activities.length > 0 ? `
                                            <div class="content-block">
                                                <strong>Activities:</strong>
                                                <ul>
                                                    ${section.activities.map(activity => `<li>${activity}</li>`).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                                ${period.wrapUpHomework ? `
                                    <div class="wrap-up">
                                        <p><strong>Recap:</strong> ${period.wrapUpHomework.recap}</p>
                                        <p><strong>Homework:</strong> ${period.wrapUpHomework.homework}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="section">
                        <h2>Differentiation Support</h2>
                        <div class="diff-grid">
                            <div class="diff-struggling">
                                <h3>Struggling Learners</h3>
                                <ul>
                                    ${chapter.differentiationSupport.strugglingLearners.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="diff-advanced">
                                <h3>Advanced Learners</h3>
                                <ul>
                                    ${chapter.differentiationSupport.advancedLearners.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2>Extensions & Project Ideas</h2>
                        <ul>
                            ${chapter.possibleExtensionsProjectIdeas.map(idea => `<li>${idea}</li>`).join('')}
                        </ul>
                    </div>
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

    return (
        <Card className="w-full max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80">
            <CardHeader className="p-6 border-b border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center gap-4 text-3xl font-bold text-gray-800">
                    <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white'>
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <span>{chapter.chapterTitle}</span>
                </CardTitle>
                 <CardDescription className="text-purple-700 text-base mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{chapter.overview.class}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Book className="h-4 w-4" />
                        <span>{chapter.overview.subject}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{chapter.overview.timeAllotment}</span>
                    </span>
                 </CardDescription>
                 <Button
                    onClick={handleDownload}
                    disabled={isGeneratingPDF}
                    className="ml-auto mr-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                    >
                    {isGeneratingPDF ? 'Opening Print Dialog...' : 'Print/Save as PDF'}
                    </Button>
            </CardHeader>
            <CardContent className="p-0 bg-gray-50/50">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-none h-auto p-2 border-b border-gray-200">
                        <TabsTrigger value="overview" className="gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"><BookCopy/> Overview</TabsTrigger>
                        <TabsTrigger value="periods" className="gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"><Clock/> Lesson Periods</TabsTrigger>
                        <TabsTrigger value="differentiation" className="gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"><Users/> Differentiation</TabsTrigger>
                        <TabsTrigger value="extensions" className="gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=color=purple-700 data-[state=active]:shadow-md"><Rocket/> Extensions</TabsTrigger>
                    </TabsList>
                    <div className="p-6">
                        <TabsContent value="overview">
                             <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl text-purple-700"><Milestone/> Chapter Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoCard label="Chapter Title" value={chapter.overview.chapter} icon={<Tag size={16} className="text-purple-700" />} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InfoCard label="Class" value={chapter.overview.class} icon={<Users size={16} className="text-purple-700" />} />
                                        <InfoCard label="Subject" value={chapter.overview.subject} icon={<Book size={16} className="text-purple-700" />} />
                                        <InfoCard label="Time Allotment" value={chapter.overview.timeAllotment} icon={<Clock size={16} className="text-purple-700" />} />
                                    </div>
                                    <InfoCard label="Learning Goals" value={chapter.overview.learningGoals} icon={<Goal size={16} className="text-purple-700" />} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="periods">
                             <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800"><Clock/> Lesson Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        {chapter.lessonBreakdown.map((period, index) => (
                                            <AccordionItem value={`item-${index}`} key={index} className="border-b-gray-200">
                                                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-gray-700">
                                                    <div className="flex items-center gap-4">
                                                         <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200/80">{period.periodName}</Badge>
                                                         <span className="text-gray-500">{period.periodTime}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-2 space-y-4 bg-gray-50 rounded-b-lg">
                                                    {period.sections.map((section, sIndex) => <SectionDisplay key={sIndex} section={section} />)}
                                                    {period.wrapUpHomework && (
                                                        <div className="mt-4 p-4 rounded-lg bg-gray-100 border border-gray-200">
                                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Wrap-up & Homework</h4>
                                                            <p className="text-gray-700"><span className='font-bold text-purple-600'>Recap:</span> {period.wrapUpHomework.recap}</p>
                                                            <p className="text-gray-700"><span className='font-bold text-purple-600'>Homework:</span> {period.wrapUpHomework.homework}</p>
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="differentiation">
                             <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800"><Users/> Differentiation Support</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                        <h3 className="font-bold text-lg text-red-700 mb-2">Struggling Learners</h3>
                                        <PointList items={chapter.differentiationSupport.strugglingLearners} icon={<Brain size={16}/>} />
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                        <h3 className="font-bold text-lg text-green-700 mb-2">Advanced Learners</h3>
                                        <PointList items={chapter.differentiationSupport.advancedLearners} icon={<Brain size={16}/>} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="extensions">
                             <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800"><Rocket/> Extension & Project Ideas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <PointList items={chapter.possibleExtensionsProjectIdeas} icon={<GitBranch size={16}/>} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}