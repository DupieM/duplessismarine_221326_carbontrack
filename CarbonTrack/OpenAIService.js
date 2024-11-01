import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const API_URL = "https://api.openai.com/v1/chat/completions"

console.log("Using API Key:", OPENAI_API_KEY);

const config = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
    }
};

// Function to retrieve insights
const getEmissionInsights = async (emissionData) => {
    console.log("Emission Data Being Sent:", emissionData);

    // Format the emission data for the prompt
    const { householdEmission, transportEmission, energyEmission, dietEmission } = emissionData;
    const formattedData = `
        Household Emission: ${householdEmission} tons CO₂,
        Transport Emission: ${transportEmission} tons CO₂,
        Energy Emission: ${energyEmission} tons CO₂,
        Diet Emission: ${dietEmission} tons CO₂.
    `;

    const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content: `Based on the following carbon emissions data, provide insights and recommendations:\n${formattedData}`
            }
        ],
        temperature: 0.7,
    };

    

    try {
        const response = await axios.post(API_URL, requestBody, config);
        console.log("Response data:", response.data);
        return response.data.choices[0].message.content; // Adjusted for detailed insights
    } catch (error) {
        console.error("Error fetching insights:", error); // Logs the whole error object
        if (error.response) {
            console.log("Error status:", error.response.status);
            console.log("Error data:", error.response.data);
        } else {
            console.log("Error message:", error.message);
        }
        throw new Error("Failed to get emission insights.");
    }
};

module.exports = { getEmissionInsights };

console.log(axios);

// const requestBody = {
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: 'Say this is a test!' }],
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