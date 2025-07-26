
"use client";

import React, { useState } from 'react';
import type { Timetable } from '@/lib/timetable-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableResponseProps {
  timetable: Timetable;
}

const subjectColors: { [key: string]: string } = {
  Math: 'bg-blue-100 text-blue-800 border-blue-200',
  Science: 'bg-green-100 text-green-800 border-green-200',
  English: 'bg-purple-100 text-purple-800 border-purple-200',
  History: 'bg-orange-100 text-orange-800 border-orange-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

const getSubjectColor = (subject: string) => {
  return subjectColors[subject] || subjectColors.default;
};

export default function TimetableResponse({ timetable }: TimetableResponseProps) {
  const [selectedClass, setSelectedClass] = useState(timetable.classes[0] || 'Class 6');

  const totalClasses = timetable.schedule.reduce((acc, curr) => {
    return acc + Object.values(curr.subjects).filter(s => s.subject !== '').length;
  }, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200/80">
      <CardHeader className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Weekly Timetable</CardTitle>
            <CardDescription className="text-gray-500">Class schedule overview</CardDescription>
          </div>
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {timetable.classes.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-4 font-semibold w-1/6"><Clock className="inline-block mr-2 h-5 w-5" />Time</th>
                {timetable.days.map(day => (
                  <th key={day} className="p-4 font-semibold">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timetable.schedule.map(timeSlot => (
                <tr key={timeSlot.time} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-600">{timeSlot.time}</td>
                  {timetable.days.map(day => (
                    <td key={day} className="p-4">
                      {timeSlot.subjects[day]?.subject ? (
                        <Badge variant="outline" className={cn("text-base font-semibold border-2 shadow-sm", getSubjectColor(timeSlot.subjects[day].subject))}>
                          {timeSlot.subjects[day].subject}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-gray-50/50 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-gray-600">Subjects:</span>
          {Object.entries(subjectColors).map(([subject, className]) => {
            if (subject === 'default') return null;
            const color = className.split(' ')[0].replace('bg-', '').split('-')[0];
            return (
              <div key={subject} className="flex items-center gap-2">
                <span className={cn('w-3 h-3 rounded-full', `bg-${color}-500`)}></span>
                <span className="text-sm text-gray-700">{subject}</span>
              </div>
            )
          })}
        </div>
        <div className="font-bold text-gray-700">
          Total classes: {totalClasses}
        </div>
      </CardFooter>
    </Card>
  );
}
