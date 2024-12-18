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
      const carbonFootprintsRef = collection(db, 'users', uid, 'carbonFootprints');
      const docRef = await addDoc(carbonFootprintsRef, formData);
      return docRef.id;  // Return the document ID
    } catch (error) {
      console.error('Error creating new entry:', error);
    }
  };

// export const createNewEntry = async (formData, uid) => {
//     try {

//         // specifying where to add the entries
//         const userRef = doc(db, "users", uid) // adding specific doc's id

//         // specifying the subcollection we want to add
//         const entryRef = collection(userRef, "carbonFootprints")

//         // adding the document into this subcollection
//         const docRef = await addDoc(entryRef, formData)

//         console.log("Success adding doc with id:" + docRef.id)
    
//         console.log("New carbon footprint entry added successfully!");
//       } catch (error) {
//         console.error("Error creating new carbon footprint entry: ", error);
//       }
// };

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
export const saveCalculationAnswer = async (uid, carbonFootprintId, answerData) => {
    try {
      const answersRef = collection(db, 'users', uid, 'carbonFootprints', carbonFootprintId, 'answers');
      await addDoc(answersRef, answerData);
      console.log('Answer saved successfully');
    } catch (error) {
      console.error('Error saving calculation answer:', error);
    }
  };

// Retrieve the answers to make charts
export const getAnswers = async (uid, carbonFootprintIds) => {
  try {
    const allAnswers = [];

    for (const carbonFootprintId of carbonFootprintIds) {
      const answersRef = collection(db, 'users', uid, 'carbonFootprints', carbonFootprintId, 'answers');
      const querySnapshot = await getDocs(answersRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Access totalEmission only from result, if it exists
        const totalEmission = data.result?.totalEmission ?? null;

        allAnswers.push({ ...data, id: doc.id, carbonFootprintId, totalEmission });
      });
    }

    return allAnswers;
  } catch (error) {
    console.error('Error retrieving answers:', error);
  }
};

// Get the OpenAI API_Key

export const getOpenAI_Key = async () => {

  try {
    let apiKey = [];

    const querySnapshot = await getDocs(collection(db, "OpenAi_API_Key"));
    querySnapshot.forEach((doc) => {
        apiKey.push({ ...doc.data(), id: doc.id }); // Push each doc's data to the array
    });

    // Check if the array is populated
    if (apiKey.length === 0) {
        console.warn("No API keys found in Firestore.");
    }

    return apiKey;
  } catch (error) {
      console.error("Error retrieving API key:", error);
      throw error; // Re-throw the error to be handled by the caller
  }

}


// export const getAnswers = async (uid, carbonFootprintIds) => {
//   try {
//     const totalEmissions = []; // Array to store totalEmission values

//     for (const carbonFootprintId of carbonFootprintIds) {
//       const answersRef = collection(db, 'users', uid, 'carbonFootprints', carbonFootprintId, 'answers');
//       const querySnapshot = await getDocs(answersRef);

//       // Loop through each document in the 'answers' subcollection
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.totalEmission) { // Check if totalEmission exists
//           totalEmissions.push({ carbonFootprintId, totalEmission: data.totalEmission });
//         }
//       });
//     }

//     return totalEmissions; // Return the array of totalEmission values
//   } catch (error) {
//     console.error('Error retrieving totalEmission values:', error);
//   }
// };