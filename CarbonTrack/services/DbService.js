// Firestore functionality
import {  collection, addDoc, getDocs, orderBy, query, doc, setDoc, where, limit } from "firebase/firestore"
import { db } from "../firebase";

//Create rest of user information from sign up page
export const createUserInformation = async (info, uid) => {
    console.log("...call creation")
    try {
        const docRef = await setDoc(doc(db, "users", uid), info);
        console.log("Document successfully written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

//Create new entry to track carbon footprint
export const createNewEntry = async (formData, uid) => {
    try {
        const docRef = await setDoc(doc(db, "carbon_footprints", uid), formData);
        console.log("Carbon footprint data successfully written");
    } catch (e) {
        console.error("Error writing document: ", e);
    }
};

//Get all the initiatives
export const getMyIniatives = async () => {

    var allIniatives = []

    const querySnapshot = await getDocs(collection(db, "courses"));
    querySnapshot.forEach((doc) => {
        allIniatives.push({...doc.data(), id: doc.id}); //push each docs' data to the array I wnat to return
        // console.log(doc.data())
    });

    return allIniatives

};

// Saving the answer of the cardbon footrack
