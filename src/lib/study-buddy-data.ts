export interface StudentProfile {
    name: string;
    strengths: string[];
    weaknesses: string[];
  }
  
  export interface StudyBuddyPair {
    student1: StudentProfile;
    student2: StudentProfile;
    reason: string;
  }
  