const axios = require('axios');
const { getOpenAI_Key } = require('./services/DbService');

const API_URL = "https://api.openai.com/v1/chat/completions"

// const callAPIKey = async () => {
//     console.log("callAPIKey function is running");

//     try {
//         // Retrieve API key from Firestore
//         console.log("Fetching API key...");
//         const apiKey = await getOpenAI_Key();
//         console.log("Using API:", apiKey);

//         const prompt = `Analyze this data: Data: 14 tons CO₂`;

//         console.log('Axios:', axios);

//         const response = await axios.post(API_URL, {
//             model: 'gpt-4o-mini',
//             messages: [
//                 { role: 'system', content: 'You are an assistant.' },
//                 { role: 'user', content: prompt }
//             ],
//             temperature: 0.3, // Controls creativity/randomness
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//             }
//         });

//         console.log(response.data.choices[0].message.content); // Log the response's text

//     } catch (error) {
//         if (error.response && error.response.status === 429) {
//             console.error('Rate limit exceeded. Please wait and try again.');
//         } else {
//             console.error('Error calling OpenAI API:', error);
//         }
//     }
// };

// console.log('Axios:', axios);

// // Call the function when the script is run
// callAPIKey();

// export const callAPIKEy = async () => {

//     console.log("callAPIKey function is running");

//     try {
//         // Retrieve API key from Firestore
//         console.log("Fetching API key...");
//         const apiKey = await getOpenAI_Key();

//         const prompt = ` analyze this data Data: 14.0 tons CO₂`;

//         const response = await axios.post(API_URL, {
//             model: 'gpt-4o-mini',
//             messages: [
//                 { role: 'system', content: 'You are an assistant.' },
//                 { role: 'user', content: prompt }
//             ],
//             temperature: 0.3, // Controls creativity/randomness
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`,
//             }
//         });

//         return response.data.choices[0].message.content // Extract the response's text

//     } catch (error) {
//         if (error.response && error.response.status === 429) {
//             console.error('Rate limit exceeded. Please wait and try again.');
//         } else {
//             console.error('Error calling OpenAI API:', error);
//         }
//     }
// }


// const config = {
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//     }
// };

// // Function to retrieve insights
// const getEmissionInsights = async (emissionData) => {
//     // console.log("Emission Data Being Sent:", emissionData);

//     // Format the emission data for the prompt
//     const { householdEmission, transportEmission, energyEmission, dietEmission } = emissionData;
//     const formattedData = `
//         Household Emission: 0.9 tons CO₂,
//         Transport Emission: 0.9 tons CO₂,
//         Energy Emission: 0.2 tons CO₂,
//         Diet Emission: 1 tons CO₂.
//     `;

//     const requestBody = {
//         model: 'gpt-4o-mini',
//         messages: [
//             {
//                 role: 'user',
//                 content: `Give me insights on what a bad carbon footprint is`
//             }
//         ],
//         temperature: 0.7,
//     };

    

//     try {
//         const response = await axios.post(API_URL, requestBody, config);
//         console.log("Response data:", response.data);
//         return response.data.choices[0].message.content;
//     } catch (error) {
//         console.error("Error fetching insights:", error);
//         if (error.response) {
//             console.log("Error status:", error.response.status);
//             console.log("Error data:", error.response.data);
//         } else {
//             console.log("Error message:", error.message);
//         }
//         throw new Error("Failed to get emission insights.");
//     }
// };

// // console.log("Axios properties:", Object.keys(axios));
// // console.log("Hi:", axios);

// module.exports = { getEmissionInsights };



// const requestBody = {
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: 'Give me insights on what a bad carbon footprint is' }],
//     temperature: 0.7,
// }

// axios
//     .post(API_URL, requestBody, config)
//     .then((response) => {
//         console.log("hi")
//     })
//     .catch((error) => {
//         console.error("Full error:", error);
//         if (error.response) {
//             console.log("Error status:", error.response.status);
//             console.log("Error data:", error.response.data);
//         } else {
//             console.log("Error message:", error.message);
//         }
//     });