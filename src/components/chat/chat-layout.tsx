
"use client";

import type { Message, Selection } from "@/lib/chat-data";
import { initialMessages } from "@/lib/chat-data";
import React, { useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import SelectionBar from "./selection-bar";
import { askPredefinedQuestion } from "@/ai/flows/predefined-questions-on-selection";
import { useToast } from "@/hooks/use-toast";
import { predefinedActions, PredefinedAction } from "@/lib/actions";
import { askFollowUpQuestion } from "@/ai/flows/follow-up-questions-on-text";
import { generateImage } from "@/ai/flows/generate-image";
import { dummyLessonPlan, dummyChapter, type Chapter } from "@/lib/lesson-plan-data";
import { dummyTimetable } from "@/lib/timetable-data";
import host from "../../../host";

interface ChatLayoutProps {
  sessionId: string | null;
}

const languages = [
  { name: "English", code: "en-US" },
  { name: "हिन्दी", code: "hi-IN" },
  { name: "தமிழ்", code: "ta-IN" },
  { name: "বাংলা", code: "bn-IN" },
  { name: "मराठी", code: "mr-IN" },
  { name: "ಕನ್ನಡ", code: "kn-IN" },
  { name: "తెలుగు", code: "te-IN" },
];

export default function ChatLayout({ sessionId }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isReplying, setIsReplying] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (isReplying) return;

    const userMessage = addMessage({
      sender: "user",
      type: "text",
      content: content,
    });

    setIsReplying(true);

    if (!sessionId) {
      console.error("Session ID is not available.");
      addMessage({
        sender: "ai",
        type: "text",
        content: "Sorry, I can't send a message right now. Please try again later.",
      });
      setIsReplying(false);
      return;
    }

    try {
      // http://localhost:4000
      const response = await fetch(host.hostName + "/api/v1/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          text: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const chatResponses = responseData.data;

      if (Array.isArray(chatResponses)) {
        chatResponses.forEach((chatResponse) => {
          let aiMessage: Omit<Message, "id" | "timestamp">;

          switch (chatResponse.type) {
            case "interactive_image":
              aiMessage = {
                sender: "ai",
                type: "interactive_image",
                content: chatResponse.text,
                imageUrl: chatResponse.image_url,
                originalContent: chatResponse.text,
              };
              break;
            case "presentation_generator":
              aiMessage = {
                sender: "ai",
                type: "presentation_generator",
                content: chatResponse.text,
                slides: chatResponse.data.slides,
                fileInfo: {
                  name: "Presentation.pptx",
                  url: "#", // a dummy url
                  type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                },
              };
              break;
            case "lesson_designer":
              aiMessage = {
                sender: "ai",
                type: "lesson_designer",
                content: chatResponse.text,
                chapterPlan: chatResponse.data,
              };
              break;
            case "curriculum_planner":
              aiMessage = {
                sender: "ai",
                type: "curriculum_planner",
                content: chatResponse.text,
                lessonPlan: chatResponse.data,
              };
              break;
            case "study_buddy":
              aiMessage = {
                sender: "ai",
                type: "study_buddy",
                content: chatResponse.text,
                studyBuddyPairs: chatResponse.pairs,
              };
              break;
            case "timetable":
              aiMessage = {
                sender: "ai",
                type: "timetable",
                content: "Here is the weekly timetable:",
                timetable: chatResponse.data || dummyTimetable,
              };
              break;
            case "text":
            default:
              aiMessage = {
                sender: "ai",
                type: "text",
                content: chatResponse.text,
                originalContent: chatResponse.text,
              };
              break;
          }
          addMessage(aiMessage);
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        sender: "ai",
        type: "text",
        content: "Sorry, something went wrong. I couldn't send your message.",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleAction = async (action: PredefinedAction, context?: Selection) => {
    const currentSelection = context || selection;
    if (!currentSelection) {
      // Handle case where suggestion chip is clicked without a selection
      addMessage({ sender: "user", type: "text", content: action });
      addMessage({ sender: "ai", type: "text", content: `You clicked on "${action}". How can I help you with that?` });
      return;
    }

    setIsReplying(true);
    setSelection(null);

    addMessage({
      sender: "user",
      type: "text",
      content: `${action} the selected ${currentSelection.type}.`,
    });

    try {
      const result = await askPredefinedQuestion({
        action,
        selectedText: currentSelection.type === "text" ? currentSelection.content : undefined,
        contextText: currentSelection.type === "text" ? currentSelection.context : undefined,
        imageDataUri: currentSelection.type === "image" ? currentSelection.content : undefined,
      });

      addMessage({
        sender: "ai",
        type: "text",
        content: result.answer,
        originalContent: result.answer,
      });
    } catch (error) {
      console.error(`Error during action "${action}":`, error);
      toast({
        title: "Error",
        description: `Could not perform the action "${action}". Please try again.`,
        variant: "destructive",
      });
      addMessage({
        sender: "ai",
        type: "text",
        content: "I'm sorry, I couldn't process that request.",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const clearSelection = () => {
    setSelection(null);
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <ChatHeader languages={languages} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      <ChatMessages messages={messages} isReplying={isReplying} addMessage={addMessage} setIsReplying={setIsReplying} setSelection={setSelection} onSend={handleSendMessage} />
      <ChatInput
        onSend={handleSendMessage}
        disabled={isReplying}
        selection={selection}
        onClearSelection={clearSelection}
        onAction={handleAction}
        selectedLanguage={selectedLanguage}
        predefinedActions={predefinedActions}
      />
    </div>
  );
}
