import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { File, FileText, Image, Video, Music, Archive } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return Image;
  if (fileType.startsWith("video/")) return Video;
  if (fileType.startsWith("audio/")) return Music;
  if (fileType === "application/pdf") return FileText;
  if (
    fileType.includes("presentation") ||
    fileType.includes("powerpoint")
  )
    return File;
  if (fileType.includes("sheet") || fileType.includes("excel"))
    return File;
  if (fileType.includes("document") || fileType.includes("word"))
    return FileText;
  if (fileType.startsWith("application/zip") || fileType.startsWith("application/x-rar-compressed")) return Archive;
  
  return File;
}
