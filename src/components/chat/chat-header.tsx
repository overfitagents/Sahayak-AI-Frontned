
"use client";

import React, { useState } from 'react';
import { GraduationCap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface Language {
  name: string;
  code: string;
}

interface ChatHeaderProps {
  languages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}

export default function ChatHeader({ languages, selectedLanguage, setSelectedLanguage }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-white/10 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-[-12deg]">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white">Sahayak AI</h1>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 text-white hover:bg-white/10 hover:text-white">
            {selectedLanguage.name}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='bg-white text-card-foreground'>
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code} onSelect={() => setSelectedLanguage(lang)} className='hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white cursor-pointer'>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
