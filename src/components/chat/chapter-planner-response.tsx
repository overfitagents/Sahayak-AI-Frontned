
"use client";

import React from 'react';
import type { Chapter } from '@/lib/lesson-plan-data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Target, Lightbulb, Activity, CheckSquare } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ChapterPlannerResponseProps {
    chapter: Chapter;
}

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transition-all duration-300 hover:border-white/30 hover:shadow-xl">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-cyan-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-4 text-purple-200">
            {children}
        </div>
    </div>
);

const InfoPill = ({ text }: { text: string }) => (
    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
        {text}
    </Badge>
);

export default function ChapterPlannerResponse({ chapter }: ChapterPlannerResponseProps) {

    return (
        <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-[rgba(118,75,162,0.6)] to-[rgba(103,58,183,0.6)] backdrop-blur-lg text-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <CardHeader className="p-0">
                <div className="p-6">
                    <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                        <div className='w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-cyan-300'>
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <span>{chapter.name}</span>
                    </CardTitle>
                </div>
                {chapter.topics.length > 0 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-2 border-b border-white/10">
                        {chapter.topics.map((topic, i) => <InfoPill key={i} text={topic} />)}
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
                <SectionCard icon={<Target className="h-5 w-5" />} title="Learning Objectives">
                    <ul className="space-y-2 list-inside">
                        {chapter.learning_objectives.map((obj, i) => <li key={i} className="flex items-start gap-2">🎯 <span className="flex-1">{obj}</span></li>)}
                    </ul>
                </SectionCard>

                <SectionCard icon={<Lightbulb className="h-5 w-5" />} title="Key Concepts">
                    <ul className="space-y-2 list-inside">
                        {chapter.key_concepts.map((concept, i) => <li key={i} className="flex items-start gap-2">💡 <span className="flex-1">{concept}</span></li>)}
                    </ul>
                </SectionCard>

                <SectionCard icon={<Activity className="h-5 w-5" />} title="Activities">
                     <ul className="space-y-2 list-inside">
                        {chapter.activities.map((act, i) => <li key={i} className="flex items-start gap-2">🤸 <span className="flex-1">{act}</span></li>)}
                    </ul>
                </SectionCard>

                <SectionCard icon={<CheckSquare className="h-5 w-5" />} title="Assessments">
                     <ul className="space-y-2 list-inside">
                        {chapter.assessments.map((asm, i) => <li key={i} className="flex items-start gap-2">✅ <span className="flex-1">{asm}</span></li>)}
                    </ul>
                </SectionCard>
            </CardContent>
        </Card>
    );
}
