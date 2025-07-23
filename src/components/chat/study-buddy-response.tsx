
"use client";

import type { Message } from '@/lib/chat-data';
import type { StudentProfile } from '@/lib/study-buddy-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyBuddyResponseProps {
  message: Message;
}

function StudentCard({ student }: { student: StudentProfile }) {
    return (
        <div className="flex-1 rounded-lg p-4 bg-white/60 border border-gray-200">
            <h4 className="font-bold text-lg text-gray-800">{student.name}</h4>
            <div className="mt-2 space-y-2">
                {student.strengths.length > 0 && (
                     <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                            <TrendingUp className="h-4 w-4" />
                            <span>Strengths</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {student.strengths.map(skill => <Badge key={skill} variant="secondary" className='bg-green-100 text-green-800 border-green-200'>{skill}</Badge>)}
                        </div>
                    </div>
                )}
                {student.weaknesses.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                            <TrendingDown className="h-4 w-4" />
                            <span>Needs Help</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {student.weaknesses.map(skill => <Badge key={skill} variant="secondary" className='bg-red-100 text-red-800 border-red-200'>{skill}</Badge>)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default function StudyBuddyResponse({ message }: StudyBuddyResponseProps) {
  if (!message.studyBuddyPairs) {
    return null;
  }

  return (
    <div className="space-y-4">
      {message.content && <p className="font-semibold text-gray-800">{message.content}</p>}
      <div className="space-y-4">
        {message.studyBuddyPairs.map((pair, index) => (
          <Card key={index} className="overflow-hidden bg-gray-50/80 shadow-md border-gray-200">
            <CardHeader className="bg-white p-4 border-b">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <Users className="text-primary" />
                <span>Pairing {index + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <StudentCard student={pair.student1} />
                    <StudentCard student={pair.student2} />
                </div>
            </CardContent>
            <CardFooter className="bg-white p-4 border-t">
                 <div className="flex items-start gap-3 text-gray-700">
                    <Lightbulb className="h-5 w-5 mt-0.5 shrink-0 text-yellow-500" />
                    <p className="text-sm"><span className="font-bold">Reason:</span> {pair.reason}</p>
                 </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
