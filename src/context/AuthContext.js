"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Try to fetch user data from Firestore
          try {
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...docSnap.data(),
              });
            } else {
              // No Firestore doc yet - use basic auth data
              setUser({ 
                uid: firebaseUser.uid, 
                email: firebaseUser.email,
                role: "SOLVER" // Default role
              });
            }
          } catch (firestoreError) {
            // Firestore failed (offline/permissions) - still allow login with basic data
            console.warn("Firestore unavailable, using basic auth data:", firestoreError.message);
            setUser({ 
              uid: firebaseUser.uid, 
              email: firebaseUser.email,
              role: "SOLVER" // Default role when offline
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login with Email/Password
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Register with Email/Password
  const register = useCallback(async (email, password, role = "SOLVER") => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Try to save to Firestore (but don't block registration if it fails)
      try {
        await setDoc(doc(db, "users", newUser.uid), {
          email: email,
          role: role,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.warn("Could not save user to Firestore:", firestoreError.message);
        // Registration still succeeds - user is created in Firebase Auth
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Login with Google
  const googleLogin = useCallback(async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Try to check/create Firestore doc (but don't block login if it fails)
      try {
        const docRef = doc(db, "users", googleUser.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            email: googleUser.email,
            role: "SOLVER",
            createdAt: new Date().toISOString(),
          });
        }
      } catch (firestoreError) {
        console.warn("Firestore unavailable during Google login:", firestoreError.message);
        // Login still succeeds - user is authenticated
      }

      return { success: true };
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);