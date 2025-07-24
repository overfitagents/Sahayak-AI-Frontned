import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, onSnapshot, setDoc,updateDoc,query,orderBy } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import host from "./host";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: host.api_key,
  authDomain: host.auth_domain,
  projectId: host.project_id,
  storageBucket: host.storage_bucket,
  messagingSenderId: host.messaging_sender_id,
  appId: host.app_id,
  // databaseURL: 'https://skillwise-webrtc-702a9-default-rtdb.firebaseio.com/',
};
console.log("Firebase config:", firebaseConfig);
// Initialize Firebase
const app: any = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps();

//Get App Auth
const firebaseAuth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

const messaging = async () => {
  const supported: any = isSupported();
  return supported ? getMessaging(app) : null;
}

export const fetchToken = async () => {
  try{
    // console.log("made it here")
    const fcmMessaging = await messaging();
    // console.log("made it 2")
    if(fcmMessaging){
      // console.log("made it 3")
      console.log("VAPID Key:", host.vap_id);
      const token = await getToken(fcmMessaging, {
        vapidKey: host.vap_id,
      });
      // console.log("made it 4", token)
      return token;
    }
  }catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export { db, firebaseAuth, messaging, collection, addDoc, doc, onSnapshot, setDoc, updateDoc,query,orderBy };