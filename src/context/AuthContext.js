"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchUserData = async (firebaseUser) => {
    try {
      const response = await fetch(`/api/users?uid=${firebaseUser.uid}`);
      if (response.ok) {
        const userData = await response.json();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData,
        };
      }
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "SOLVER",
      };
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "SOLVER",
      };
    }
  };

  
  const saveUserData = async (uid, email, role = "SOLVER") => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, role }),
      });
      return response.ok;
    } catch (err) {
      console.error("Failed to save user data:", err);
      return false;
    }
  };

  
  const updateProfile = useCallback(async (profileData) => {
    if (!user?.uid) return { success: false, error: "Not logged in" };

    try {
      const response = await fetch(`/api/users/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser((prev) => ({ ...prev, ...updatedUser }));
        return { success: true };
      }
      return { success: false, error: "Failed to update profile" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [user]);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser);
          setUser(userData);
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

  
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  
  const register = useCallback(async (email, password, role = "SOLVER") => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      
      await saveUserData(newUser.uid, email, role);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  
  const googleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      
      const existingUser = await fetch(`/api/users?uid=${googleUser.uid}`);
      if (existingUser.status === 404) {
        await saveUserData(googleUser.uid, googleUser.email, "SOLVER");
      }

      return { success: true };
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  
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
    updateProfile,
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