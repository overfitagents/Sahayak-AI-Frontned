"use client";

import { Message, Selection } from '@/lib/chat-data';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Eraser, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface InteractiveImageProps {
  message: Message;
  setSelection: (selection: Selection | null) => void;
}

export default function InteractiveImage({ message, setSelection }: InteractiveImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  
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
      setSelection(null);
    }
  };

  const handleSelectArea = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCtx.drawImage(image, 0, 0);
    tempCtx.drawImage(canvas, 0, 0, image.naturalWidth, image.naturalHeight);

    const dataUri = tempCanvas.toDataURL('image/png');
    setSelection({ type: 'image', content: dataUri });
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
        <p className="text-sm font-semibold text-muted-foreground">You can draw on the image to ask a question about a specific area.</p>
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
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => { setScale(1); }}><Maximize/></Button></TooltipTrigger>
                        <TooltipContent><p>Reset Zoom</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={clearDrawing} disabled={!hasDrawing}><Eraser /></Button></TooltipTrigger>
                        <TooltipContent><p>Clear Drawing</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            <Button onClick={handleSelectArea} disabled={!hasDrawing}>
                Select area
            </Button>
        </div>
    </div>
  );
}
