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
export const createNewEntry = async (formData, carbonFootprint, uid) => {
    try {

        // specifying where to add the entries
        const userRef = doc(db, "users", uid) // adding specific doc's id

        // specifying the subcollection we want to add
        const entryRef = collection(userRef, "carbonFootprints")

        // adding the document into this subcollection
        const docRef = await addDoc(entryRef, formData)

        console.log("Success adding doc with id:" + docRef.id)



        // // Reference to the user's carbonFootprints subcollection
        // const userRef = db.collection('users').doc(uid).collection('carbonFootprints');
    
        // // Add a new document with an auto-generated ID
        // await userRef.add(formData);
    
        console.log("New carbon footprint entry added successfully!");
      } catch (error) {
        console.error("Error creating new carbon footprint entry: ", error);
      }
};

//Get all the initiatives
export const getMyIniatives = async () => {

    var allIniatives = []

    const querySnapshot = await getDocs(collection(db, "initiative"));
    querySnapshot.forEach((doc) => {
        allIniatives.push({...doc.data(), id: doc.id}); //push each docs' data to the array I wnat to return
        // console.log(doc.data())
    });

    return allIniatives

};

// Saving the answer of the cardbon footrack
export const createRecordingOfCarbonFootprint = async () => {

};
