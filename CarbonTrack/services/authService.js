// Firebase Auth Functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../firebase";
import { createUserInformation } from "./DbService";

// Log In
export const handleLogin = async (email, password) => {

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("Logged In User -" + user.email)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    });

}

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