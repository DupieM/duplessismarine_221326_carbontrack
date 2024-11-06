import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native'
import { getAnswers, getOpenAI_Key } from '../services/DbService';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const API_URL = "https://api.openai.com/v1/chat/completions";

function  ResultScreen({ navigation, route }){

    // creating const varibles to call functions and data
    const { carbonFootprint } = route.params; // retrieve form data from tracker screen
    const [carbonFootprintIds, setCarbonFootprintIds] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emissionInsights, setEmissionInsights] = useState('');

    const [loadingtwo, setLoadingTwo] = useState(true);
    const [errortwo, setErrortwo] = useState(null);
    const [insights, setInsights] = useState(null);
    const [opeAi, setOpenAi] = useState([]);

    // The api call for openAi
    useEffect(() => {
        const callAPIKey = async () => {
            console.log("callAPIKey function is running");

            try {
                // Retrieve API key from Firestore
                console.log("Fetching API key...");

                const apiKey = OPENAI_API_KEY;

                // const prompt = `Give me short insights on these data: dietEmission 1.3 tons CO₂, energyEmission 0.4 tons CO₂, householdEmission 2.7 tons CO₂, totalEmission 4.75 tons CO₂ and transportEmission 0.4 tons CO₂`;

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
                    temperature: 0.3, // Controls creativity/randomness
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    }
                });

                // console.log(response.data.choices[0].message.content); // Log the response's text
                setInsights(response.data.choices[0].message.content); // Store insights in state
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.error('Rate limit exceeded. Please wait and try again.');
                    setErrortwo('Rate limit exceeded. Please wait and try again.');
                } else {
                    console.error('Error calling OpenAI API:', error);
                    setErrortwo('Error calling OpenAI API.');
                }
            } finally {
                setLoadingTwo(false);
            }
        };

        callAPIKey();
    }, []);

    // Function to retrieve the carbonfootrpisnt from the user that is logged in currently
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
          return []; // Return an empty array on error
        }
    };

    // function to fetch uid of user that is logged in
    useEffect(() => {
        const fetchCarbonFootprintIds = async () => {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const ids = await fetchYourCarbonFootprintIds(uid);
                setCarbonFootprintIds(ids);
            }
        };
        fetchCarbonFootprintIds();
    }, []);
    
    // function to call the ansers that is retrieved from firestore to plot on charts
    useEffect(() => {
        if (carbonFootprintIds && carbonFootprintIds.length > 0) {
            const fetchData = async () => {
                try {
                    const uid = auth.currentUser?.uid;
                    const retrievedAnswers = await getAnswers(uid, carbonFootprintIds);
                    setAnswers(retrievedAnswers || []); // Fallback to empty array if undefined
                } catch (err) {
                    setError("Error retrieving answers");
                    console.error("Error retrieving answers:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setLoading(false); // If no IDs are available, stop loading
        }
    }, [carbonFootprintIds]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    const totalEmissions = (answers || []) // Fallback to empty array if answers is undefined
        .map(answer => answer.result?.totalEmission)
        .filter(emission => emission !== undefined);

    // Sort the answers based on timestamp in ascending order
    const sortedAnswers = (answers || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Generate date labels from the sorted answers
    const dateLabels = sortedAnswers.map(answer => {
        const date = new Date(answer.timestamp);
        return date.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
    });

    //Quickchart url for bar chart of total emission
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
                labels: {
                    fontColor: 'white', // Legend text color
                    fontFamily: 'NunitoMedium'
                }
            },
            tooltips: {
                titleFontColor: 'white',
                bodyFontColor: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'white',
                borderWidth: 1
            }
        }
    };

    const barChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(barChartConfig))}`;

    // Extract emissions data
    const emissionsData = [carbonFootprint.householdEmission || 0, carbonFootprint.transportEmission || 0, carbonFootprint.energyEmission || 0, carbonFootprint.dietEmission || 0];

    //Quickchart url for polar area chart for breakdown of emission data
    const chartConfig = {
        type: 'polarArea',
        data: {
            labels: ['Home', 'Transportation', 'Energy', 'Diet'],
            datasets: [{
                data: emissionsData.map(value => value || 0),
                backgroundColor: ['#f5c542', '#60B6FF', '#42f5a1', '#f54242'],
                borderWidth: 0   // home - transport - energy - diet
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
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Your Carbon</Text>
                <Text style={styles.mainhead2}>Footprint</Text>
                <Text style={styles.subhead}>Insights based on your carbon footprint data below</Text>
            </View>
            <View>
                <View>
                    <Image
                        style={styles.chartImage}
                        source={{ uri: barChartUrl }}
                        resizeMode="contain"
                    />
                </View>
            </View>
            <View>
                <Image
                    style={styles.chartImageTwo}
                    source={{ uri: chartUrl }}
                    resizeMode="contain"
                />
            </View>
            <View>
                <Text style={styles.Insights_head}>Emission Insights</Text>
                <View>
                    <Text style={styles.Insights_body}>{insights}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Reduce')}>
                <Text style={styles.cardparagrap2}>
                    Tips to reduce{"\n"}
                    footprint
                </Text>
                <Image style={styles.tips} source={require('../assets/Tips.png')}/>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ResultScreen

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
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'center',
        fontFamily: 'NunitoMedium',
    }
});