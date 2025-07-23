
"use client";

import { type LessonPlan } from '@/lib/lesson-plan-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface LessonPlannerResponseProps {
    plan: LessonPlan;
}

const BulletList = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) return <span className="text-muted-foreground">-</span>;
  return (
    <ul className="list-disc pl-4 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default function LessonPlannerResponse({ plan }: LessonPlannerResponseProps) {
  return (
    <div className="space-y-6 text-card-foreground">
        <Card className='bg-white/10 backdrop-blur-md border-white/20'>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{plan.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm pt-1">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Academic Year: {plan.academic_year}</Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Subject: {plan.subject}</Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Class: {plan.grade}</Badge>
                </CardDescription>
            </CardHeader>
        </Card>

      {plan.terms.map((term, termIndex) => (
        <div key={termIndex} className="space-y-4">
          <h2 className="text-xl font-bold p-3 bg-black/10 rounded-lg backdrop-blur-md text-white">{term.term_name}</h2>
          {term.months.map((month, monthIndex) => (
            <div key={monthIndex} className="space-y-4">
              <h3 className="text-lg font-semibold pl-3 text-white">{month.month}</h3>
                <div className="overflow-x-auto rounded-lg border border-white/20">
                  <Table>
                    <TableHeader className='bg-black/20'>
                      <TableRow className="border-b-white/20">
                        <TableHead className="w-[100px] text-white/90">Month</TableHead>
                        <TableHead className="min-w-[200px] text-white/90">Chapter & Topics</TableHead>
                        <TableHead className="min-w-[250px] text-white/90">Learning Objectives</TableHead>
                        <TableHead className="min-w-[250px] text-white/90">Key Concepts</TableHead>
                        <TableHead className="min-w-[250px] text-white/90">Activities</TableHead>
                        <TableHead className="min-w-[200px] text-white/90">Assessment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {month.chapters.map((chapter, chapterIndex) => (
                        <TableRow key={chapterIndex} className="bg-white/5 even:bg-white/10 border-b-white/20">
                          <TableCell className="font-medium text-white">{month.month}</TableCell>
                          <TableCell className="text-white">
                            <div className="font-semibold">{chapter.name}</div>
                            <BulletList items={chapter.topics} />
                          </TableCell>
                          <TableCell className="text-white"><BulletList items={chapter.learning_objectives} /></TableCell>
                          <TableCell className="text-white"><BulletList items={chapter.key_concepts} /></TableCell>
                          <TableCell className="text-white"><BulletList items={chapter.activities} /></TableCell>
                          <TableCell className="text-white"><BulletList items={chapter.assessments} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            </div>
          ))}
        </div>
      ))}
       <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white">General Teaching Strategies & Considerations</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-white/90">
                    {plan.general_strategies.map((strategy, index) => (
                        <li key={index}>{strategy}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
