
"use client";

import React, { useState } from 'react';
import type { Chapter, LessonBreakdown, DifferentiationSupport, Section } from '@/lib/lesson-plan-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from '../ui/badge';
import { BookOpen, Target, Lightbulb, Activity, CheckSquare, Clock, Users, Brain, Rocket, ListChecks, ArrowRight, BookCopy, Zap, GitBranch, Milestone } from 'lucide-react';

interface ChapterPlannerResponseProps {
    chapter: Chapter;
}

const InfoCard = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-sm font-semibold text-purple-300 mb-1">{label}</p>
        <div className="p-3 rounded-lg bg-white/10 border border-white/20 text-white/90 text-base">
            {value}
        </div>
    </div>
);

const PointList = ({ items, icon }: { items: string[], icon: React.ReactNode }) => (
    <ul className="space-y-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span className="text-cyan-300 mt-1">{icon}</span>
                <span className="flex-1">{item}</span>
            </li>
        ))}
    </ul>
);

const SectionDisplay = ({ section }: { section: Section }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2"><ListChecks className="text-cyan-400" /> {section.title}</h4>
            <Badge variant="outline" className="border-cyan-400/50 text-cyan-300">{section.time}</Badge>
        </div>
        <div className="space-y-4 text-purple-200/90">
            {section.points.length > 0 && (
                <div>
                    <h5 className="font-bold mb-2 text-white/80">Key Points:</h5>
                    <PointList items={section.points} icon={<ArrowRight size={16}/>} />
                </div>
            )}
            {section.activities.length > 0 && (
                <div>
                     <h5 className="font-bold mb-2 text-white/80">Activities:</h5>
                    <PointList items={section.activities} icon={<Zap size={16}/>} />
                </div>
            )}
        </div>
    </div>
);

export default function ChapterPlannerResponse({ chapter }: ChapterPlannerResponseProps) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[rgba(118,75,162,0.8)] to-[rgba(103,58,183,0.8)] backdrop-blur-lg text-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <CardHeader className="p-6 border-b border-white/10">
                <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                    <div className='w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-cyan-300'>
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <span>{chapter.chapterTitle}</span>
                </CardTitle>
                 <CardDescription className="text-purple-300 text-base mt-1">
                    {chapter.overview.class} • {chapter.overview.subject} • {chapter.overview.timeAllotment}
                 </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-black/20 rounded-none h-auto p-2">
                        <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"><BookCopy/> Overview</TabsTrigger>
                        <TabsTrigger value="periods" className="gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"><Clock/> Lesson Periods</TabsTrigger>
                        <TabsTrigger value="differentiation" className="gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"><Users/> Differentiation</TabsTrigger>
                        <TabsTrigger value="extensions" className="gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white"><Rocket/> Extensions</TabsTrigger>
                    </TabsList>
                    <div className="p-6">
                        <TabsContent value="overview">
                             <Card className="bg-black/10 border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl"><Milestone/> Chapter Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoCard label="Chapter Title" value={chapter.overview.chapter} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InfoCard label="Class" value={chapter.overview.class} />
                                        <InfoCard label="Subject" value={chapter.overview.subject} />
                                        <InfoCard label="Time Allotment" value={chapter.overview.timeAllotment} />
                                    </div>
                                    <InfoCard label="Learning Goals" value={chapter.overview.learningGoals} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="periods">
                             <Card className="bg-black/10 border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl"><Clock/> Lesson Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        {chapter.lessonBreakdown.map((period, index) => (
                                            <AccordionItem value={`item-${index}`} key={index} className="border-b-white/10">
                                                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-purple-200">
                                                    <div className="flex items-center gap-4">
                                                         <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 border-cyan-400/50">{period.periodName}</Badge>
                                                         <span>{period.periodTime}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="p-2 space-y-4">
                                                    {period.sections.map((section, sIndex) => <SectionDisplay key={sIndex} section={section} />)}
                                                    {period.wrapUpHomework && (
                                                        <div className="mt-4 p-4 rounded-lg bg-black/20">
                                                            <h4 className="text-lg font-semibold text-white mb-2">Wrap-up & Homework</h4>
                                                            <p><span className='font-bold text-purple-300'>Recap:</span> {period.wrapUpHomework.recap}</p>
                                                            <p><span className='font-bold text-purple-300'>Homework:</span> {period.wrapUpHomework.homework}</p>
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
                             <Card className="bg-black/10 border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl"><Users/> Differentiation Support</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <h3 className="font-bold text-lg text-red-300 mb-2">Struggling Learners</h3>
                                        <PointList items={chapter.differentiationSupport.strugglingLearners} icon={<Brain size={16}/>} />
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <h3 className="font-bold text-lg text-green-300 mb-2">Advanced Learners</h3>
                                        <PointList items={chapter.differentiationSupport.advancedLearners} icon={<Brain size={16}/>} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="extensions">
                             <Card className="bg-black/10 border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl"><Rocket/> Extension & Project Ideas</CardTitle>
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
