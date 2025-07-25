
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Download, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Slide, Selection } from '@/lib/chat-data';
import PptInteractiveImage from './ppt-interactive-image';

interface PptViewerProps {
  slides: Slide[];
  fileName?: string;
  fileUrl?: string;
}

export default function PptViewer({ slides, fileName = "Presentation.pptx", fileUrl }: PptViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [selection, setSelection] = useState<Selection | null>(null);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, isOpen]);

  if (!slides || slides.length === 0) {
    return null; // Don't render anything if there are no slides
  }
  
  const currentSlide = slides[currentSlideIndex];
  
  if (!currentSlide) {
    return null;
  }

  return (
    <>
      <div className="p-3 rounded-lg bg-gray-200 flex flex-col items-start gap-3 w-full max-w-sm">
        <div className="flex items-center gap-3">
          <svg className="h-10 w-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 5.5a1.5 1.5 0 0 0-3 0V10h3V8.5zm2 0V10h7V8.5a1.5 1.5 0 0 0-3 0zm-2 3V13h10v-1.5a1.5 1.5 0 0 0-3 0zm-1.5 3a1.5 1.5 0 0 0 0 3H10v-3H8.5z" />
          </svg>
          <div>
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="text-sm text-gray-600">PowerPoint Presentation</p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <Button onClick={() => setIsOpen(true)} className="flex-1" variant="secondary">
            <Eye className="mr-2" /> View
          </Button>
          {fileUrl && (
            <a href={fileUrl} download={fileName} className="flex-1">
              <Button className="w-full">
                <Download className="mr-2" /> Download
              </Button>
            </a>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-purple-50 p-0 border-none">
           <DialogHeader className="p-4 bg-purple-600 text-white flex-row items-center justify-between rounded-t-lg">
            <DialogTitle>{currentSlide.heading}</DialogTitle>
             <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white rounded-full">
                    <X className="h-5 w-5" />
                </Button>
             </DialogClose>
          </DialogHeader>

           <div className="flex-1 bg-purple-50 p-6 flex items-center justify-center overflow-hidden">
             <div className={cn("flex w-full h-full gap-8 transition-all duration-300", isFullScreen ? "items-center justify-center" : "items-start")}>
                <div className={cn("relative transition-all duration-300 ease-in-out flex", isFullScreen ? 'w-full h-full justify-center' : 'w-1/2 h-full')}>
                    <PptInteractiveImage 
                        // imageUrl={currentSlide.image.inlineData.data}
                        imageUrl={`data:${currentSlide.image.inlineData.mimeType};base64,${currentSlide.image.inlineData.data}`}
                        setSelection={setSelection}
                        isFullScreen={isFullScreen}
                        setIsFullScreen={setIsFullScreen}
                    />
                </div>

                <div className={cn(
                    "w-1/2 h-full flex flex-col justify-center transition-all duration-300 ease-in-out", 
                    isFullScreen ? 'w-0 opacity-0' : 'w-1/2 opacity-100'
                )}>
                     <div key={currentSlideIndex} className="slide-content active">
                        <h2 className="text-4xl font-bold text-purple-800 mb-6">{currentSlide.heading}</h2>
                        <ul className="space-y-4">
                            {currentSlide.points.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
                                    <ChevronRight className="h-6 w-6 text-purple-500 mt-1 shrink-0" />
                                    <span>{point}</span>
                                 </li>
                            ))}
                        </ul>
                    </div>
                </div>
             </div>
           </div>
          
           <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 rounded-b-lg">
                <Button onClick={handlePrev} disabled={currentSlideIndex === 0} variant="outline" className="gap-2 text-gray-800">
                    <ChevronLeft className="h-4 w-4 text-gray-600" /> Prev
                </Button>
                <span className="text-sm font-medium text-gray-600">
                    {currentSlideIndex + 1} / {slides.length}
                </span>
                <Button onClick={handleNext} disabled={currentSlideIndex === slides.length - 1} className="gap-2 bg-purple-600 hover:bg-purple-700">
                    Next <ChevronRight />
                </Button>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
