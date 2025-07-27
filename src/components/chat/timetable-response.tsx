
"use client";

import React, { useState } from 'react';
import type { Timetable } from '@/lib/timetable-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableResponseProps {
  timetable: any;
}

const subjectColors: { [key: string]: string } = {
  Math: 'bg-blue-100 text-blue-800 border-blue-200',
  Science: 'bg-green-100 text-green-800 border-green-200',
  English: 'bg-purple-100 text-purple-800 border-purple-200',
  History: 'bg-orange-100 text-orange-800 border-orange-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

const getSubjectColor = (subject: any) => {
  return subjectColors[subject] || subjectColors.default;
};

export default function TimetableResponse({ timetable }: TimetableResponseProps) {
  console.log("Timetable data:", timetable);
 const [selectedClass, setSelectedClass] = useState(
  timetable ? Object.keys(timetable)[0] : 'class_6'
);

const totalClasses: number = timetable && timetable[selectedClass]
  ? Object.values(timetable[selectedClass] as Record<string, { subject: string; time: string }[]>).reduce(
      (acc, day) => acc + (Array.isArray(day) ? day.length : 0),
      0
    )
  : 0;





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
            {Object.keys(timetable || {}).map(c => (
  <SelectItem key={c} value={c}>{c.replace('class_', 'Class ')}</SelectItem>
))}

          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-purple-600 text-white">
        <tr>
          <th className="p-4 font-semibold w-1/6">
            <Clock className="inline-block mr-2 h-5 w-5" />
            Time
          </th>
          {Object.keys(timetable[selectedClass]).map(day => (
            <th key={day} className="p-4 font-semibold">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {(() => {
          // Extract all time slots across all days to build unique sorted time slots
          const allSlots = Object.values(timetable[selectedClass] || {}).flat();
          const uniqueTimes = Array.from(new Set(allSlots.map((slot: any) => slot.time))).sort();

          return uniqueTimes.map(time => (
            <tr key={time} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-600">{time}</td>
              {Object.keys(timetable[selectedClass]).map(day => {
                const slot = (timetable[selectedClass][day] || []).find((s: any) => s.time === time);
                return (
                  <td key={day} className="p-4">
                    {slot && slot.subject ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-base font-semibold border-2 shadow-sm",
                          getSubjectColor(slot.subject)
                        )}
                      >
                        {slot.subject}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ));
        })()}
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
