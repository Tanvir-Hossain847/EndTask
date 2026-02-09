"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Auth State changes (Login/Logout)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 2. User is logged in, now fetch their ROLE from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...docSnap.data(), // This spreads the 'role' into the user object
          });
        } else {
          // If no doc exists yet (edge case)
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        }
      } else {
        // 3. User is logged out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* We only render the app once we know the Auth Status */}
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
           <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);