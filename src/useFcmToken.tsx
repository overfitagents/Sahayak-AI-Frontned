"use client"

import { useEffect, useRef, useState } from "react";
import { onMessage } from "firebase/messaging";
import { fetchToken, messaging } from "../firebase"; // Your Firebase web init logic
import { useRouter } from "next/navigation";
import host from "../host";






// Request permission and get browser token (used if not in WebView)
async function getNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission denied");
  return false;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<any>(null);
  const [token, setToken] = useState(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  //  token loader ( web)
  const loadToken = async () => {
    if (isLoading.current) return;
    isLoading.current = true;




    // Fallback to browser token
  
      const browserToken: any = await getNotificationPermission();

      if (Notification.permission === "denied") {
        setNotificationPermissionStatus("denied");
        isLoading.current = false;
        return;
      }

      if (!browserToken) {
        if (retryLoadToken.current >= 3) {
          setNotificationPermissionStatus("denied");
          isLoading.current = false;
          return;
        }

        retryLoadToken.current += 1;
        console.log("Retrying to fetch browser token...", retryLoadToken.current);
        isLoading.current = false;
        await loadToken();
        return;
      }

      setToken(browserToken);
    

    setNotificationPermissionStatus(Notification.permission);
    console.log("FCM Token value before setting:", browserToken);
    
    isLoading.current = false;
  };

  // On mount, try to load token
useEffect(() => {
  loadToken();
}, []);

useEffect(() => {
  console.log("FCM token value changed :", token)
},[token])


  // Send token to backend
  const getFcmToken = () => {
    console.log("FCM Came here checkpoint 3 : ", token)
    if (!token) return;
    console.log("FCM Came here checkpoint 4 : ", token)
    fetch(`${host.hostName}/api/v1/fcm-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_type: "web",
        token: token,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/logout");
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("FCM token sent response:", data);
      })
      .catch((err) => {
        console.error("Error sending FCM token to backend:", err);
      });
  };

  // Foreground notification listener
useEffect(() => {
  console.log("FCM Came here checkpoint 1 : ", token)
  if (!token) return;
  console.log("FCM Came here checkpoint 2 : ", token)
  getFcmToken();

  const setupListeners = async () => {
    const m = await messaging();
    if (!m) return;

    const unsubscribe = onMessage(m, (payload) => {
      console.log("Foreground push received:", payload);

      if (Notification.permission !== "granted") return;

      const link = payload.fcmOptions?.link || payload.data?.link;

      const n = new Notification(payload.notification?.title || "New Message", {
        body: payload.notification?.body || "You have a new message",
        data: link ? { url: link } : undefined,
      });

      n.onclick = (event: any) => {
        event.preventDefault();
        const link = event.target?.data?.url;
        if (link) {
          window.open(link, "_blank");
        }
      };
    });

    return unsubscribe;
  };

  let unsubscribe: any = null;
  setupListeners().then((unsub) => {
    unsubscribe = unsub;
  });

  return () => unsubscribe?.();
}, [token]); // Only runs after token is non-null


  return { token, notificationPermissionStatus };
};

export default useFcmToken;
