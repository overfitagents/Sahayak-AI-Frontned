
"use client";

import { Selection } from "@/lib/chat-data";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { PredefinedAction } from "@/lib/actions";
import { Quote, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface SelectionBarProps {
  selection: Selection;
  onClear: () => void;
  onAction: (action: PredefinedAction) => void;
  actions: readonly PredefinedAction[];
}

function TextSelectionPreview({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Quote className="h-4 w-4 shrink-0 text-primary mt-1" />
      <p className="line-clamp-2 text-muted-foreground italic">
        "{content}"
      </p>
    </div>
  );
}

function ImageSelectionPreview({ content }: { content: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
       <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
       <Image src={content} alt="Selected region" width={40} height={40} className="rounded-md border"/>
       <p className="text-muted-foreground">Selected image region</p>
    </div>
  )
}

export default function SelectionBar({ selection, onClear, onAction, actions }: SelectionBarProps) {
  return (
    <div className="p-3 border-b max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-primary">Replying to</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClear}>
              <X className="h-4 w-4"/>
              <span className="sr-only">Clear selection</span>
            </Button>
          </div>
          {selection.type === 'text' ? (
            <TextSelectionPreview content={selection.content} />
          ) : (
            <ImageSelectionPreview content={selection.content} />
          )}
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap pt-3">
        <div className="flex gap-2 pb-2">
          {actions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => onAction(action)}
              className="h-8"
            >
              {action}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
