// Firebase Auth Functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, getAuth} from "firebase/auth";
import { auth, db } from "../firebase";
import { createUserInformation } from "./DbService";

// Log In
export const handleLogin = async (email, password) => {
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged In User -" + user.email);
      return true; // Login success
  } catch (error) {
      console.log(error.message); // Log the error for debugging
      throw error; // Throw the error to be caught in the login function
  }
};

// Reset password of account
export const resetPassword = async (email) => {
  try {
    const authInstance = getAuth();
    await sendPasswordResetEmail(authInstance, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error resetting password:", error.message);
  }
};

// Create an account
export const handleSignin = async (email, password, info) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("Signed In User -" + user.uid)
      // TODO: send uid back
      const db = await createUserInformation(info, user.uid)
      // const userdb = await getUsers(user.uid)
      return user.uid
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      return null
    });
}

// Log Out
export const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
}