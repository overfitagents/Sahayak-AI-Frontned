// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyBI5Gatir3XbH55qoSTGsgowWRMEWzGQQ0",
  authDomain: "petcare-c42e6.firebaseapp.com",
  projectId: "petcare-c42e6",
  storageBucket: "petcare-c42e6.firebasestorage.app",
  messagingSenderId: "228711701643",
  appId: "1:228711701643:web:4490a4c04d7888a943888e",
};
// IMPORTANT: Replace the placeholder values above with your actual Firebase project configuration.
// You *must* manually copy these values here because the service worker cannot access environment variables.

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Optional: Add an icon
    data: payload.data // Include custom data like callId
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// Handle notification click event
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification);
  event.notification.close();

  // Extract call ID or relevant data from the notification
  const link = event.notification.data?.link; // Assuming callId is passed in data
  console.log("Link: ", link);
  const redirectUrl = link ? link : '/'; // Redirect to join page or home

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    console.log("Client List: ", clientList);
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client) // Adjust the URL check if needed
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(redirectUrl);
  }));
});
