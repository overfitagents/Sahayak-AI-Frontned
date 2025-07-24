"use client"

import ChatLayout from '@/components/chat/chat-layout';
import  useFcmToken  from "../useFcmToken"
import { useEffect } from 'react';

export default function Home() {
  const { notificationPermissionStatus } = useFcmToken();
  useEffect(() => {
    if (notificationPermissionStatus === "denied") {
      console.info("Notification permission denied");
    } else if (notificationPermissionStatus === "granted") {
      console.info("Notification permission granted");
    } else if (notificationPermissionStatus === "default") {
      console.info("Notification permission default");
    }
  }, []);
  return <ChatLayout />;
}
