import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Button } from 'react-native';
import { getAnswers, getOpenAI_Key } from '../services/DbService';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';

const API_URL = "https://api.openai.com/v1/chat/completions";

function ResultScreen({ navigation, route }) {
    // creating const varibles to call functions and data
    const carbonFootprint = route.params?.carbonFootprint || {}; // Use default empty object if undefined
    const [carbonFootprintIds, setCarbonFootprintIds] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emissionInsights, setEmissionInsights] = useState('');
    const [loadingtwo, setLoadingTwo] = useState(true);
    const [errortwo, setErrortwo] = useState(null);
    const [insights, setInsights] = useState(null);

    

    // The api call for openAi
    useEffect(() => {
        const callAPIKey = async () => {
            // Check if any emission data is available
            const hasEmissionsData = carbonFootprint.householdEmission || carbonFootprint.transportEmission || carbonFootprint.energyEmission || carbonFootprint.dietEmission;
    
            // Only make the API call if there is data to analyze
            if (hasEmissionsData) {
                try {
                    const apiKey = OPENAI_API_KEY;
                    const prompt = `Provide short insights on these emissions: 
                    - Diet Emission: ${carbonFootprint.dietEmission || 0} tons CO₂,
                    - Energy Emission: ${carbonFootprint.energyEmission || 0} tons CO₂,
                    - Household Emission: ${carbonFootprint.householdEmission || 0} tons CO₂,
                    - Transport Emission: ${carbonFootprint.transportEmission || 0} tons CO₂,
                    - Total Emission: ${carbonFootprint.totalEmission || 0} tons CO₂.`;
    
                    const response = await axios.post(API_URL, {
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: 'You are an assistant.' },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.3,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        }
                    });
    
                    setInsights(response.data.choices[0].message.content);
                } catch (error) {
                    if (error.response && error.response.status === 429) {
                        setErrortwo('Rate limit exceeded. Please wait and try again.');
                    } else {
                        setErrortwo('Error calling OpenAI API.');
                    }
                } finally {
                    setLoadingTwo(false);
                }
            } else {
                // If no data, set a message or leave insights blank
                setInsights("View insights for your carbon footprint, once calculated");
                setLoadingTwo(false); // Ensure loading state ends
            }
        };
    
        callAPIKey();
    }, [carbonFootprint]);

     // Helper function to remove all instances of '**' from text
     const removeAsterisks = (text) => {
        return text ? text.replace(/\*\*/g, '') : '';
    };

    // Function to retrieve the carbonfootprint from the user that is logged in currently
    const fetchYourCarbonFootprintIds = async (uid) => {
        if (!uid) {
            console.error('UID is missing. Cannot fetch carbon footprint IDs.');
            return [];
        }

        try {
            const carbonFootprintsRef = collection(db, 'users', uid, 'carbonFootprints');
            const querySnapshot = await getDocs(carbonFootprintsRef);
            const ids = querySnapshot.docs.map(doc => doc.id); // Get the document IDs
          console.log("Fetched Carbon Footprint IDs:", ids); // Debugging line
          return ids; // Return an array of IDs
        } catch (error) {
            console.error('Error fetching carbon footprint IDs:', error);
            return [];
        }
    };

    // Fetch the user's carbon footprint answers
    const fetchAnswers = async () => {
        setLoading(true);
        try {
            const uid = auth.currentUser?.uid;
            const ids = await fetchYourCarbonFootprintIds(uid);
            setCarbonFootprintIds(ids);
            
            if (ids && ids.length > 0) {
                const retrievedAnswers = await getAnswers(uid, ids);
                setAnswers(retrievedAnswers || []);
            }
        } catch (err) {
            setError("Error retrieving answers");
            console.error("Error retrieving answers:", err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnswers();
        }, [])
    );

    const handleRefresh = () => {
        fetchAnswers();  // Re-fetch answers when refresh button is pressed
    };

    console.log("Retrieved answers:", answers);

    // Data processing for charts and charts URLs
    const totalEmissions = (answers || []) // Fallback to empty array if answers is undefined
        .map(answer => answer.result?.totalEmission)
        .filter(emission => emission !== undefined);

    // Sort the answers based on timestamp in ascending order
    const sortedAnswers = (answers || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Generate date labels from the sorted answers
    const dateLabels = sortedAnswers.map(answer => {
        const date = new Date(answer.timestamp);
        return date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: '2-digit' });
    });

    // Quickchart url for bar chart of total emission
    const generateBarChartUrl = () => {
        const totalEmissions = (answers || [])
            .map(answer => answer.result?.totalEmission)
            .filter(emission => emission !== undefined);

        const sortedAnswers = (answers || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const dateLabels = sortedAnswers.map(answer => {
            const date = new Date(answer.timestamp);
            return date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: '2-digit' });
        });

        const barChartConfig = {
            type: 'bar', 
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Total CO₂',
                    data: totalEmissions,
                    backgroundColor: '#96D629', // Bar color
                    borderColor: '#96D629',
                    borderWidth: 1,
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        color: 'white',  // Text color for the data labels
                        anchor: 'end',  // Positions the labels at the end of each bar
                        align: 'top',   // Aligns labels at the top of the bars
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        formatter: (value) => `${value} CO₂`  // Display value with CO₂ unit
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white', // Y-axis text color
                            callback: function(value) { return `${value} CO₂`; }
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'white' // X-axis text color
                        },
                    }]
                },
                title: {
                    display: true,
                    text: 'Your Emissions Over Time',
                    fontSize: 20,
                    fontColor: 'white' // Title text color
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        fontColor: 'white' // Legend text color
                    },
                },
                tooltips: {
                    titleFontColor: 'white',
                    bodyFontColor: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: 'white',
                    borderWidth: 1
                }
            }}

        return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(barChartConfig))}`;
    };

    const barChartUrl = generateBarChartUrl();

    // Extract emissions data
    const hasEmissionsData = carbonFootprint.householdEmission || carbonFootprint.transportEmission || carbonFootprint.energyEmission || carbonFootprint.dietEmission || carbonFootprint.totalEmission;

    //Quickchart url for polar area chart for breakdown of emission data
    const chartUrl = hasEmissionsData ? `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
        type: 'polarArea',
        data: {
            labels: ['Home', 'Transportation', 'Energy', 'Diet'],
            datasets: [{
                data: [
                    carbonFootprint.householdEmission || 0,
                    carbonFootprint.transportEmission || 0,
                    carbonFootprint.energyEmission || 0,
                    carbonFootprint.dietEmission || 0
                ],
                backgroundColor: ['#f5c542', '#60B6FF', '#42f5a1', '#f54242'],
                borderWidth: 0
            }],
        },
        options: {
            plugins: {
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    formatter: function(value) {
                        return value > 0 ? value + ' ton CO₂' : '';
                    },
                    color: 'white',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
            },
            title: {
                display: true,
                text: 'Your current emissions per category',
                fontColor: '#FFFFFF',
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: '#FFFFFF',
                },
                
            },
            layout: {
                padding: {
                    right: 50,
                }
            }
        }

    }))}` : null;

    // Pass the carbonfootprint to the reduce screen
    // const reducescreennavigate = () => {
    //     navigation.navigate('Reduce', { Emission: carbonFootprint })
    // }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Your Carbon</Text>
                <Text style={styles.mainhead2}>Footprint</Text>
                <Text style={styles.subhead}>Insights based on your carbon footprint data below</Text>
            </View>

            <TouchableOpacity style={styles.refresh} onPress={handleRefresh}>
                <Ionicons name="refresh" size={27} color="white" />
            </TouchableOpacity>

            <Image style={styles.chartImage} source={{ uri: barChartUrl }} resizeMode="contain" />

            {chartUrl ? (
                <Image style={styles.chartImageTwo} source={{ uri: chartUrl }} resizeMode="contain" />
            ) : (
                <Text style={styles.noDataMessage}>Go to Track to work out your current carbon footprint</Text>
            )}
            <View>
                <Text style={styles.Insights_head}>Emission Insights</Text>
                <Text style={styles.Insights_body}>
                    {removeAsterisks(insights) || "Loading...."}
                </Text>
            </View>
            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Reduce', { Emission: carbonFootprint })}>
                <Text style={styles.cardparagrap2}>
                    Tips to reduce{"\n"}footprint
                </Text>
                <Image style={styles.tips} source={require('../assets/Tips.png')}/>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default ResultScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
    },
    head: {
        alignItems: 'center',
        marginTop: 30
    },
    mainhead: {
        fontSize: 66,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
    },
    mainhead2: {
        marginTop: -20,
        fontSize: 66,
        fontWeight: '500',
        color: 'white',
        marginBottom: 15,
        fontFamily: 'PatrickHand',
    },
    subhead: {
        fontSize: 14,
        color: '#C1FF1C',
        fontFamily: 'NunitoItalic'
    },
    graph: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 34,
        color: '#438EF3'
    },
    refresh: {
        marginTop: 20,
        marginBottom: -48,
        marginLeft: 317
    },
    chartImage: {
        marginLeft: 3,
        width: 350,
        height: 250,
    },
    chartImageTwo: {
        marginLeft: -4,
        width: 400,
        height: 300,
        marginTop: -38
    },
    cardone: {
        backgroundColor: '#3AA345',
        marginRight: 27,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        marginLeft: 27,
        height: 94,
        marginBottom: 20,
        marginTop: 30
    },
    cardparagrap2: {
        fontSize: 30,
        color: '#C1FF1C',
        marginRight: 20,
        fontFamily: 'NunitoMedium',
    },
    tips: {
        marginTop: 4
    },
    Insights_head: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        marginBottom:   10,
        marginTop: -15,
        fontFamily: 'NunitoMedium',
    },
    Insights_body: {
        color: '#C1FF1C',
        fontSize: 20,
        letterSpacing: 2,
        marginLeft: 40,
        marginRight: 30,
        textAlign: 'left',
        fontFamily: 'NunitoMedium',
    },
    noDataMessage: { 
        fontSize: 16, 
        color: '#C1FF1C', 
        textAlign: 'center', 
        marginTop: 10,
        marginBottom: 30
    },
});

