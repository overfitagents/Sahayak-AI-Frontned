
"use client";

import { Selection } from '@/lib/chat-data';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Eraser, ZoomIn, ZoomOut, Pencil, RectangleHorizontal, Circle, ArrowRight, Type, RefreshCw, Expand, Minimize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

interface InteractiveImageProps {
  imageUrl: string;
  setSelection: (selection: Selection | null) => void;
  isFullScreen?: boolean;
  setIsFullScreen?: (isFullScreen: boolean) => void;
}

type Tool = 'pencil' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'eraser';

export default function InteractiveImage({ imageUrl, setSelection, isFullScreen, setIsFullScreen }: InteractiveImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState<Tool>('pencil');
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  const getCanvasContext = () => canvasRef.current?.getContext('2d');

  const startInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    const pos = getMousePos(e);
    setStartPoint(pos);
    setIsDrawing(true);
    setHasDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    
    if (tool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
            ctx.font = `${16 / scale}px sans-serif`;
            ctx.fillStyle = '#FF0000';
            ctx.fillText(text, pos.x, pos.y);
        }
        setIsDrawing(false);
    }
  };

  const interact = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const currentPos = getMousePos(e);

    ctx.lineWidth = 3 / scale;
    ctx.strokeStyle = '#FF0000';

    if (tool === 'pencil') {
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
    } else if (tool === 'eraser') {
        ctx.clearRect(currentPos.x - 10/scale, currentPos.y - 10/scale, 20/scale, 20/scale);
    }
  };

  const stopInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx || !isDrawing) return;

    const endPoint = getMousePos(e);

    ctx.lineWidth = 3 / scale;
    ctx.strokeStyle = '#FF0000';
    
    if (tool === 'rectangle') {
        ctx.strokeRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
    } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    } else if (tool === 'arrow') {
        drawArrow(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }

    if (tool === 'pencil' || tool === 'eraser') {
        ctx.closePath();
    }
    
    setIsDrawing(false);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) => {
    const headlen = 10 / scale;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }
  
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const canvas = canvasRef.current!;
    return {
      x: (e.clientX - rect.left) / (rect.width / canvas.width),
      y: (e.clientY - rect.top) / (rect.height / canvas.height)
    };
  }

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
      setSelection(null);
      setScale(1);
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
            if (width === 0) return;
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const height = width / aspectRatio;

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }
      };
      if (image.complete) {
        setCanvasSize();
      } else {
        image.onload = setCanvasSize;
      }
      const resizeObserver = new ResizeObserver(setCanvasSize);
      if(containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      
      return () => {
        if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
        }
      }
    }
  }, [imageUrl]);
  
  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
        const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
        return Math.max(0.5, Math.min(newScale, 5));
    });
  };

  const ToolButton = ({ selfTool, currentTool, setTool, children, tooltip }: { selfTool: Tool, currentTool: Tool, setTool: (t: Tool) => void, children: React.ReactNode, tooltip: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant={currentTool === selfTool ? "secondary" : "outline"} size="icon" onClick={() => setTool(selfTool)}>
                {children}
            </Button>
        </TooltipTrigger>
        <TooltipContent><p>{tooltip}</p></TooltipContent>
    </Tooltip>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4 w-full h-full">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2 justify-between items-center text-gray-700">
            <div className='flex gap-1'>
                <ToolButton selfTool='pencil' currentTool={tool} setTool={setTool} tooltip="Pencil"><Pencil/></ToolButton>
                <ToolButton selfTool='rectangle' currentTool={tool} setTool={setTool} tooltip="Rectangle"><RectangleHorizontal/></ToolButton>
                <ToolButton selfTool='circle' currentTool={tool} setTool={setTool} tooltip="Circle"><Circle/></ToolButton>
                <ToolButton selfTool='arrow' currentTool={tool} setTool={setTool} tooltip="Arrow"><ArrowRight/></ToolButton>
                <ToolButton selfTool='text' currentTool={tool} setTool={setTool} tooltip="Text"><Type/></ToolButton>
                <ToolButton selfTool='eraser' currentTool={tool} setTool={setTool} tooltip="Eraser"><Eraser/></ToolButton>
            </div>
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
                    <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={clearDrawing}><RefreshCw/></Button></TooltipTrigger>
                    <TooltipContent><p>Reset Changes</p></TooltipContent>
                </Tooltip>
            </div>
        </div>
      </TooltipProvider>
      <div ref={containerRef} className="relative flex-1 w-full bg-gray-100 cursor-crosshair overflow-hidden rounded-lg shadow-inner">
        <div 
            className="relative w-full h-full transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Interactive content"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            crossOrigin="anonymous"
            data-ai-hint="diagram chart"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0"
            onMouseDown={startInteraction}
            onMouseMove={interact}
            onMouseUp={stopInteraction}
            onMouseLeave={stopInteraction}
          />
        </div>
        {setIsFullScreen && (
          <div className="absolute top-2 right-2">
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="secondary" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="rounded-full shadow-md">
                              {isFullScreen ? <Minimize/> : <Expand/>}
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>{isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
        )}
      </div>

      <div className="flex justify-end">
          <Button onClick={handleSelectArea} disabled={!hasDrawing}>
              Select area
          </Button>
      </div>
    </div>
  );
}
