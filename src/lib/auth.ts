import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

// Create user profile in Firestore
const createUserProfile = async (
  user: FirebaseUser,
  additionalData?: { displayName?: string }
) => {
  if (!user || !db) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        displayName: additionalData?.displayName || displayName || "",
        email,
        photoURL: photoURL || "",
        createdAt,
        updatedAt: createdAt,
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  return getUserProfile(user.uid);
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  if (!db) return null;

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  }

  return null;
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
) => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update the user's display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Create user profile in Firestore
    await createUserProfile(user, { displayName });

    return user;
  } catch (error: AnyType) {
    console.error("Error signing up with email:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: AnyType) {
    console.error("Error signing in with email:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  try {
    const provider = new GoogleAuthProvider();
    // Optional: Add custom parameters
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const { user } = await signInWithPopup(auth, provider);

    // Create user profile in Firestore if it doesn't exist
    await createUserProfile(user);

    return user;
  } catch (error: AnyType) {
    console.error("Error signing in with Google:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign out
export const signOut = async () => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: AnyType) {
    console.error("Error sending password reset email:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Auth state observer
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  if (!auth) {
    console.warn("Firebase auth is not initialized");
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by the browser.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
};
