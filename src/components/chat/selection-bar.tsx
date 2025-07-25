
"use client";

import { Selection } from "@/lib/chat-data";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { PredefinedAction } from "@/lib/actions";
import { Quote, Image as ImageIcon, X, ArrowLeft, Info, HelpCircle, BookOpen, ListChecks, PencilRuler } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SelectionBarProps {
  selection: Selection;
  onClear: () => void;
  onAction: (action: PredefinedAction) => void;
  actions: readonly PredefinedAction[];
}

function TextSelectionPreview({ content }: { content: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100/50 border border-yellow-200">
      <div className="flex-shrink-0 w-10 h-10 bg-yellow-200/80 text-yellow-700 rounded-lg flex items-center justify-center">
        <Quote className="h-5 w-5" />
      </div>
      <p className="line-clamp-2 text-sm text-yellow-800 font-medium">
        "{content}"
      </p>
    </div>
  );
}

function ImageSelectionPreview({ content }: { content: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100/50 border border-yellow-200">
        <div className="flex-shrink-0 w-10 h-10 bg-yellow-200/80 text-yellow-700 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-5 w-5" />
        </div>
       <p className="text-sm font-medium text-yellow-800">Selected image region</p>
       <Image src={content} alt="Selected region" width={40} height={40} className="rounded-md border ml-auto"/>
    </div>
  )
}

const actionIcons: { [key in PredefinedAction]: React.ElementType } = {
  Explain: Info,
  Question: HelpCircle,
  Analogy: BookOpen,
  Activity: ListChecks,
  Revision: PencilRuler,
};

const actionColors = {
  Explain: "text-blue-600 bg-blue-100/80 border-blue-300/70 hover:bg-blue-200/70",
  Question: "text-red-600 bg-red-100/80 border-red-300/70 hover:bg-red-200/70",
  Analogy: "text-orange-600 bg-orange-100/80 border-orange-300/70 hover:bg-orange-200/70",
  Activity: "text-green-600 bg-green-100/80 border-green-300/70 hover:bg-green-200/70",
  Revision: "text-purple-600 bg-purple-100/80 border-purple-300/70 hover:bg-purple-200/70",
};

export default function SelectionBar({ selection, onClear, onAction, actions }: SelectionBarProps) {
  return (
    <div className="max-w-4xl mx-auto p-1 bg-transparent">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <ArrowLeft className="h-5 w-5" />
                    <p className="text-sm font-semibold">Replying to</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" onClick={onClear}>
                    <X className="h-5 w-5"/>
                    <span className="sr-only">Clear selection</span>
                </Button>
            </div>
            
            <div className="mb-4">
                {selection.type === 'text' ? (
                    <TextSelectionPreview content={selection.content} />
                ) : (
                    <ImageSelectionPreview content={selection.content} />
                )}
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                {actions.map((action) => {
                    const Icon = actionIcons[action];
                    return (
                        <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            onClick={() => onAction(action)}
                            className={cn("h-9 border-2 font-semibold transition-all duration-200 transform hover:scale-105", actionColors[action])}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {action}
                        </Button>
                    )
                })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    </div>
  );
}
