"use client";

import { questionsAboutImageAreas } from '@/ai/flows/questions-about-image-areas';
import { Message } from '@/lib/chat-data';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Loader2, Eraser, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface InteractiveImageProps {
  message: Message;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
}

export default function InteractiveImage({ message, addMessage, setIsReplying }: InteractiveImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const { toast } = useToast();

  const getCanvasContext = () => canvasRef.current?.getContext('2d');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawing(true);
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = 3 / scale;
    ctx.setLineDash([6 / scale, 3 / scale]);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };
  
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  }

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsSubmitting(true);
    setDialogOpen(false);
    addMessage({
      sender: 'user',
      type: 'text',
      content: `Question about image area: ${question}`,
    });
    setIsReplying(true);

    try {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image) throw new Error('Elements not found');
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = image.naturalWidth;
      tempCanvas.height = image.naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('Could not create temp canvas context');
      
      tempCtx.drawImage(image, 0, 0);
      
      const ratioX = image.naturalWidth / canvas.width;
      const ratioY = image.naturalHeight / canvas.height;
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = image.naturalWidth;
      scaledCanvas.height = image.naturalHeight;
      const scaledCtx = scaledCanvas.getContext('2d');
      if (!scaledCtx) throw new Error('Could not create scaled canvas context');
      
      scaledCtx.drawImage(canvas, 0, 0, image.naturalWidth, image.naturalHeight);
      
      tempCtx.drawImage(scaledCanvas, 0, 0);

      const photoDataUri = tempCanvas.toDataURL('image/png');

      const result = await questionsAboutImageAreas({
        photoDataUri,
        question,
      });

      addMessage({
        sender: 'ai',
        type: 'text',
        content: result.answer,
        originalContent: result.answer,
      });
    } catch (error) {
      console.error('Error asking question about image:', error);
      toast({
        title: 'Error',
        description: 'Could not process the image. Please try again.',
        variant: 'destructive',
      });
      addMessage({
        sender: 'ai',
        type: 'text',
        content: "I'm sorry, I couldn't process that request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsReplying(false);
      setQuestion('');
      clearDrawing();
    }
  };
  
  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (image && canvas) {
      const setCanvasSize = () => {
        const container = containerRef.current;
        if(container){
            const { width } = container.getBoundingClientRect();
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            canvas.width = width;
            canvas.height = width / aspectRatio;
            image.style.width = `${width}px`;
            image.style.height = `${width / aspectRatio}px`;
        }
      };
      if (image.complete) {
        setCanvasSize();
      } else {
        image.onload = setCanvasSize;
      }
      window.addEventListener('resize', setCanvasSize);
      return () => window.removeEventListener('resize', setCanvasSize);
    }
  }, []);
  
  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
        const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
        return Math.max(1, Math.min(newScale, 5));
    });
  };

  return (
    <div className="space-y-2">
        <p className="text-sm text-muted-foreground">You can draw on the image to ask a question about a specific area.</p>
        <div ref={containerRef} className="relative w-full overflow-hidden border rounded-lg bg-black/10">
            <Image
            ref={imageRef}
            src={message.content}
            alt="Interactive content"
            width={600}
            height={400}
            className="transition-transform duration-300"
            style={{ transform: `scale(${scale})`, cursor: isDrawing ? 'crosshair' : 'default' }}
            crossOrigin="anonymous"
            data-ai-hint="cityscape skyline"
            />
            <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ cursor: 'crosshair', transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
        </div>
        <div className="flex gap-2 justify-between items-center">
            <TooltipProvider>
                <div className="flex gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleZoom('in')}><ZoomIn/></Button></TooltipTrigger>
                        <TooltipContent><p>Zoom In</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleZoom('out')}><ZoomOut/></Button></TooltipTrigger>
                        <TooltipContent><p>Zoom Out</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => { setScale(1); setOffset({x:0, y:0})}}><Maximize/></Button></TooltipTrigger>
                        <TooltipContent><p>Reset Zoom</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={clearDrawing} disabled={!hasDrawing}><Eraser /></Button></TooltipTrigger>
                        <TooltipContent><p>Clear Drawing</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            <Button onClick={() => setDialogOpen(true)} disabled={!hasDrawing}>
                Ask about marked area
            </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Ask about the marked area</DialogTitle>
            </DialogHeader>
            <Textarea
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAskQuestion} disabled={isSubmitting || !question.trim()}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ask
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
