export interface StudentProfile {
    name: string;
    avatar: string; // URL to an avatar image
    strengths: string[];
    weaknesses: string[];
  }
  
  export interface StudyBuddyPair {
    student1: StudentProfile;
    student2: StudentProfile;
    reason: string;
  }
  