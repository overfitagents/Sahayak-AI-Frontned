
"use client"

import ChatLayout from '@/components/chat/chat-layout';
import  useFcmToken  from "@/useFcmToken"
import { useEffect, useState } from 'react';
import host from '../../host';

export default function Home() {
  const { notificationPermissionStatus } = useFcmToken();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (notificationPermissionStatus) {
      console.info(`Notification permission: ${notificationPermissionStatus}`);
    }
  }, [notificationPermissionStatus]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("https://dev-sahayak-server-543433794712.us-central1.run.app/api/v1/session");
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSessionId(data.data.id);
        console.log('Session ID fetched:', data.data.id);
      } catch (error) {
        console.error('Error fetching session ID:', error);
      }
    };

    getSession();
  }, []);

  return <ChatLayout sessionId={sessionId} />;
}
