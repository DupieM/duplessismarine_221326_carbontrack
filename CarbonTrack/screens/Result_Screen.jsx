import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native'
import { getAnswers } from '../services/DbService';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function  ResultScreen({ navigation, route }){

    const { carbonFootprint } = route.params;
    const [carbonFootprintIds, setCarbonFootprintIds] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
    
      useEffect(() => {
        console.log("Retrieved answers:", answers);
    }, [answers]);

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

    //Quickchart url for chart one
    const barChartConfig = {
        type: 'bar', 
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Total CO2',
                data: totalEmissions,
                backgroundColor: 'rgba(75, 192, 192, 0.9)', // Bar color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
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
                    fontColor: 'white' // Legend text color
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
    const { householdEmission = 0, transportEmission = 0, energyEmission = 0, dietEmission = 0} = carbonFootprint;

    // Extract emissions data and default to zero if undefined
    const emissionsData = [
        householdEmission || 0,
        transportEmission || 0,
        energyEmission || 0,
        dietEmission || 0,
    ];
    console.log("Emissions Data:", emissionsData);

    //Quickchart url for chart two
    const chartConfig = {
        type: 'polarArea',
        data: {
            labels: ['Home', 'Transportation', 'Energy', 'Diet'],
            datasets: [{
                data: emissionsData.map(value => value || 0),
                backgroundColor: ['#f5c542', '#f54291', '#42f5a1', '#f54242'],
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
                text: 'Your emission data per category',
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
                <Text style={styles.graph}>Graph</Text>
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
        fontSize: 58,
        fontWeight: '500',
        color: 'white'
    },
    mainhead2: {
        marginTop: -20,
        fontSize: 58,
        fontWeight: '500',
        color: 'white'
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
        marginBottom: 20
    },
    cardparagrap2: {
        fontSize: 30,
        color: '#C1FF1C',
        marginRight: 20
    },
    tips: {
        marginTop: 4
    }
});