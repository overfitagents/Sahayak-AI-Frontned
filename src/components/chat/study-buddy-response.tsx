
"use client";

import type { Message } from '@/lib/chat-data';
import type { StudentProfile } from '@/lib/study-buddy-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpenCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudyBuddyResponseProps {
  message: Message;
}

function StudentCard({ student }: { student: StudentProfile }) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    return (
        <Card className="flex-1 rounded-2xl bg-gray-100 shadow-lg transform transition-transform hover:scale-105 duration-300">
            <CardHeader className='items-center text-center p-4'>
                <Avatar className="w-20 h-20 mb-2 border-4 border-gray-200/80 shadow-md">
                    <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person student" />
                    <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <CardTitle className='text-xl text-gray-800'>{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-center">
                {student.strengths.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-sm text-green-600 mb-1.5">💪 Strengths</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {student.strengths.map(skill => <Badge key={skill} variant="secondary" className='text-base border-2 shadow-sm bg-green-100 text-green-800 border-green-300/50'>{skill}</Badge>)}
                        </div>
                    </div>
                )}
                {student.weaknesses.length > 0 && (
                    <div className='mt-4'>
                        <h4 className="font-semibold text-sm text-red-600 mb-1.5">🆘 Needs Help</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {student.weaknesses.map(skill => <Badge key={skill} variant="secondary" className='text-base border-2 shadow-sm bg-red-100 text-red-800 border-red-300/50'>{skill}</Badge>)}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export default function StudyBuddyResponse({ message }: StudyBuddyResponseProps) {
  if (!message.studyBuddyPairs) {
    return null;
  }

  return (
    <div className="space-y-4 font-sans">
      {message.content && <p className="font-semibold text-gray-800 text-base leading-relaxed">{message.content}</p>}
      <div className="space-y-6">
        {message.studyBuddyPairs.map((pair, index) => (
          <Card key={index} className="overflow-hidden bg-gradient-to-br from-[rgba(118,75,162,0.8)] to-[rgba(103,58,183,0.8)] backdrop-blur-sm shadow-xl rounded-2xl border-white/20">
            <CardHeader className="bg-black/10 p-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white/90">
                <Users className="text-purple-300 h-7 w-7" />
                <span>Study Team {index + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 relative">
                    <StudentCard student={pair.student1} />
                    <div className="flex items-center justify-center text-purple-300 my-2 sm:my-0">
                        <BookOpenCheck className="h-10 w-10" />
                    </div>
                    <StudentCard student={pair.student2} />
                </div>
            </CardContent>
            <CardFooter className="bg-black/10 p-4">
                 <div className="flex items-start gap-3 text-white/80">
                    <Lightbulb className="h-6 w-6 mt-0.5 shrink-0 text-yellow-400" />
                    <p className="text-sm"><span className="font-bold text-white/90">Pairing Logic:</span> {pair.reason}</p>
                 </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
