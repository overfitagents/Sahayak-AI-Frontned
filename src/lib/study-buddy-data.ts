export interface StudentProfile {
    name: string;
    avatar?: string; // URL to an avatar image, now optional
    strengths: string[];
    needs_help: string[];
  }
  
  export interface StudyBuddyPair {
    name: string;
    members: StudentProfile[];
    pairing_logic: string;
  }
  