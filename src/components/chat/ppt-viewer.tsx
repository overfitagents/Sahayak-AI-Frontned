
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';

// The library doesn't have type definitions, so we declare it as a module
declare const PptxViewer: any;

interface PptViewerProps {
  fileUrl: string;
}

export default function PptViewer({ fileUrl }: PptViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This ensures the component only renders on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen && isClient && viewerRef.current) {
      // Load the pptx-viewer script dynamically
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/pptx-viewer@0.6.2/dist/pptx-viewer.js";
      script.async = true;
      script.onload = () => {
        if (viewerRef.current) {
          // Clear any previous viewer instance
          viewerRef.current.innerHTML = '';
          // Initialize the viewer
          PptxViewer.render(fileUrl, viewerRef.current, {
             slide_scale: "100%",
             show_thumbnail: false,
          });
        }
      };
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen, isClient, fileUrl]);

  return (
    <div className="p-3 rounded-lg bg-gray-200 flex flex-col items-start gap-3 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <svg
          className="h-10 w-10 text-orange-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 5.5a1.5 1.5 0 0 0-3 0V10h3V8.5zm2 0V10h7V8.5a1.5 1.5 0 0 0-3 0zm-2 3V13h10v-1.5a1.5 1.5 0 0 0-3 0zm-1.5 3a1.5 1.5 0 0 0 0 3H10v-3H8.5z" />
        </svg>
        <div>
          <p className="font-semibold text-gray-800">Presentation.pptx</p>
          <p className="text-sm text-gray-600">PowerPoint Presentation</p>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button onClick={() => setIsOpen(true)} className="flex-1" variant="outline">
          <Eye className="mr-2" /> View
        </Button>
        <a href={fileUrl} download className="flex-1">
          <Button className="w-full">
            <Download className="mr-2" /> Download
          </Button>
        </a>
      </div>

      {isClient && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Presentation Viewer</DialogTitle>
            </DialogHeader>
            <div
              ref={viewerRef}
              className="flex-1 bg-gray-800 rounded-md overflow-auto"
              // The library injects its own UI, so we just provide a container
            >
              <p className="text-white text-center p-8">Loading presentation...</p>
            </div>
             <DialogFooter className="pt-4 !justify-between">
               <div id="pptx-viewer-controls" className="flex items-center gap-2">
                 {/* The library is supposed to inject controls, but we can add our own if needed */}
                 <Button id="prev-slide" variant="outline"><ChevronLeft/> Prev</Button>
                 <span id="slide-number" className="text-sm font-medium"></span>
                 <Button id="next-slide" variant="outline">Next <ChevronRight/></Button>
               </div>
               <Button onClick={() => setIsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
