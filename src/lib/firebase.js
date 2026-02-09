import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

// 1. Log to confirm config is actually loading
if (!firebaseConfig.projectId) {
  console.error("CRITICAL: Firebase Config is missing or empty. Check .env file.");
}

let app;
let db;

// 2. Singleton Pattern with Long Polling Force
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Force Long Polling: This fixes "client offline" in environments where WebSockets are blocked
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  app = getApp();
  // If app exists, we try to get Firestore. 
  // NOTE: If Firestore was already initialized by a previous hot-reload WITHOUT long-polling, 
  // you might need to refresh the page to apply this change.
  db = getFirestore(app);
}

export const auth = getAuth(app);
export { db };
export default app;