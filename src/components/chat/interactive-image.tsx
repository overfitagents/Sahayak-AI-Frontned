
"use client";

import { Selection } from '@/lib/chat-data';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Eraser, ZoomIn, ZoomOut, Maximize, Pencil, RectangleHorizontal, Circle, ArrowRight, Type } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

interface InteractiveImageProps {
  imageUrl: string;
  setSelection: (selection: Selection | null) => void;
}

type Tool = 'pencil' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'eraser';

export default function InteractiveImage({ imageUrl, setSelection }: InteractiveImageProps) {
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
    return {
      x: (e.clientX - rect.left), // Divide by scale later for drawing operations
      y: (e.clientY - rect.top)
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
            if (width === 0) return;
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const height = width / aspectRatio;

            canvas.width = width;
            canvas.height = height;
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
    <div className="space-y-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2 justify-between items-center p-2 border rounded-lg bg-gray-50">
            <div className='flex gap-1'>
                <ToolButton selfTool='pencil' currentTool={tool} setTool={setTool} tooltip="Pencil"><Pencil/></ToolButton>
                <ToolButton selfTool='rectangle' currentTool={tool} setTool={setTool} tooltip="Rectangle"><RectangleHorizontal/></ToolButton>
                <ToolButton selfTool='circle' currentTool={tool} setTool={setTool} tooltip="Circle"><Circle/></ToolButton>
                <ToolButton selfTool='arrow' currentTool={tool} setTool={setTool} tooltip="Arrow"><ArrowRight/></ToolButton>
                <ToolButton selfTool='text' currentTool={tool} setTool={setTool} tooltip="Text"><Type/></ToolButton>
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
                    <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => { setScale(1); }}><Maximize/></Button></TooltipTrigger>
                    <TooltipContent><p>Reset Zoom</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild><Button variant="destructive" size="icon" onClick={clearDrawing} disabled={!hasDrawing}><Eraser /></Button></TooltipTrigger>
                    <TooltipContent><p>Clear All</p></TooltipContent>
                </Tooltip>
            </div>
        </div>
      </TooltipProvider>

      <div ref={containerRef} className="relative w-full overflow-hidden border rounded-lg bg-black/10" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', cursor: 'crosshair' }}>
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Interactive content"
            width={600}
            height={400}
            className="w-full h-auto transition-transform duration-300"
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
      <div className="flex justify-end">
          <Button onClick={handleSelectArea} disabled={!hasDrawing}>
              Select area
          </Button>
      </div>
    </div>
  );
}
