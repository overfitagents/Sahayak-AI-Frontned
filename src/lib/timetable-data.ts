
export interface TimetableEntry {
  subject: string;
}

export interface TimetableSchedule {
  time: string;
  subjects: { [key: string]: TimetableEntry };
}

export interface Timetable {
  title: string;
  description: string;
  classes: string[];
  days: string[];
  schedule: TimetableSchedule[];
}

export const dummyTimetable: Timetable = {
  title: 'Weekly Timetable',
  description: 'Class schedule overview',
  classes: ['Class 6', 'Class 7', 'Class 8'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  schedule: [
    {
      time: '9:00-10:00',
      subjects: {
        Mon: { subject: 'Math' },
        Tue: { subject: 'History' },
        Wed: { subject: 'Science' },
        Thu: { subject: 'English' },
        Fri: { subject: 'Math' },
      },
    },
    {
      time: '10:00-11:00',
      subjects: {
        Mon: { subject: 'Science' },
        Tue: { subject: 'Math' },
        Wed: { subject: '' },
        Thu: { subject: 'History' },
        Fri: { subject: 'Science' },
      },
    },
    {
      time: '11:00-12:00',
      subjects: {
        Mon: { subject: 'English' },
        Tue: { subject: '' },
        Wed: { subject: 'English' },
        Thu: { subject: '' },
        Fri: { subject: '' },
      },
    },
  ],
};
