
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Play, StopCircle, Loader2 } from 'lucide-react';
import { convertTextToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  text: string;
  isUserMessage?: boolean;
}

export default function AudioPlayer({ text, isUserMessage = false }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);
    try {
      const { audioDataUri } = await convertTextToSpeech({ text });
      const audio = new Audio(audioDataUri);
      audioRef.current = audio;
      
      audio.play();
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
      };
      
    } catch (error) {
      console.error("Error converting text to speech:", error);
      toast({
        title: "Error",
        description: "Could not play audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const buttonStyle = isUserMessage ? "text-white/80 hover:text-white hover:bg-white/20" : "text-gray-500 hover:text-gray-800 hover:bg-gray-200";

  return (
    <div className="inline-flex items-center">
      {isLoading ? (
        <Button variant="ghost" size="icon" className={cn("h-7 w-7", buttonStyle)} disabled>
          <Loader2 className="animate-spin" />
        </Button>
      ) : isPlaying ? (
        <Button variant="ghost" size="icon" onClick={handleStop} className={cn("h-7 w-7", buttonStyle)}>
          <StopCircle />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={handlePlay} className={cn("h-7 w-7", buttonStyle)}>
          <Play />
        </Button>
      )}
    </div>
  );
}
