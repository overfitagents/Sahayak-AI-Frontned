"use client";

import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  'English',
  'हिन्दी', // Hindi
  'தமிழ்', // Tamil
  'বাংলা', // Bengali
  'मराठी', // Marathi
  'ಕನ್ನಡ', // Kannada
  'తెలుగు', // Telugu
];

export default function ChatHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <header className="flex items-center justify-between p-3 border-b bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">Sahayak</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1">
            {selectedLanguage}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map((lang) => (
            <DropdownMenuItem key={lang} onSelect={() => setSelectedLanguage(lang)}>
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
