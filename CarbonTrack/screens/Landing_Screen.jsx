import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { handleSignOut } from '../services/authService'
import { getAnswers } from '../services/DbService'
import { auth, db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

function  LandingScreen({ navigation }){

    // Logout
    const handleSignout = () => {
        handleSignOut()
    }

    const [averageEmission, setAverageEmission] = useState(null);
    const globalAverage = 4.7;
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
        answers.forEach((answer, index) => {
            console.log(`Answer ${index + 1} totalEmission:`, answer.totalEmission);
        });
    }, [answers]);

    // Calculate average emission whenever answers are updated
    useEffect(() => {
        if (answers.length > 0) {
            const validEmissions = answers
                .map(answer => parseFloat(answer.totalEmission)) // Ensure conversion to number
                .filter(emission => !isNaN(emission) && emission > 0); // Filter valid numeric values
    
            if (validEmissions.length > 0) {
                const totalEmission = validEmissions.reduce((sum, emission) => sum + emission, 0);
                const avgEmission = totalEmission / validEmissions.length;
                setAverageEmission(avgEmission);
            } else {
                console.warn("No valid emissions found in answers.");
                setAverageEmission(0);
            }
        } else {
            setAverageEmission(0);
        }
    }, [answers]);

    

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    const chartConfig = {
        type: 'bar',
        data: {
            labels: ['Your Average Emission', 'Global Average Emission'],
            datasets: [{
                label: 'Average Emission (tons CO₂)',
                data: [averageEmission || 0, globalAverage],
                backgroundColor: ['#438EF3', '#FF6384'],
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'white'
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white'
                }
            }
        }
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;


    return (
        <ScrollView style={styles.container}>
            <View style={styles.container2}>
                <View style={styles.head}>
                    <Text style={styles.mainhead}>Know your</Text>
                    <Text style={styles.mainhead2}>impact</Text>
                </View>
                <View>
                    <Image style={styles.chartImage} source={{ uri: chartUrl }} resizeMode="contain" />
                </View>
                <View>
                    <Text style={styles.subhead}>Explore CarbonTrack</Text>
                    <View>
                        <View style={styles.box}>
                            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Tracker')}>
                                <Image source={require('../assets/Calculate.png')}/>
                                <Text style={styles.cardparagrap}>
                                    Calculate{"\n"}
                                    Footprint
                                </Text>
                            </TouchableOpacity>
                            <Image style={styles.image} source={require('../assets/planet_earth_1.png')}/>
                        </View>
                    </View>
                    <View>
                        <View style={styles.box}>
                            <Image style={styles.image2} source={require('../assets/planet_earth_2.png')}/>
                            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Reduce')}>
                                <Text style={styles.cardparagrap2}>
                                    Tips to{"\n"}
                                    reduce
                                </Text>
                                <Image style={styles.tips} source={require('../assets/Tips.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.signout}>
                        <Text style={styles.signouttext}>We hope to see you agin? </Text>
                        <TouchableOpacity style={styles.button} onPress={handleSignout}>
                            <Text style={styles.buttontext}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </ScrollView>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
    },
    container2: {
        alignItems: 'left',
    },
    head: {
        alignItems: 'center',
        marginTop: 25
    },
    mainhead: {
        fontSize: 60,
        fontWeight: '500',
        color: 'white'
    },
    mainhead2: {
        marginTop: -20,
        fontSize: 60,
        fontWeight: '500',
        color: 'white'
    },
    chartImage: {
        marginLeft: 8,
        width: 340,
        height: 220,
    },
    graph: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 34,
        color: '#438EF3',
        textAlign: 'center',
    },
    subhead: {
        fontSize: 36,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500'
    },
    box: {
        flexDirection: 'row',
        marginTop: 30,
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
        height: 94
    },
    cardparagrap: {
        marginLeft: 15,
        fontSize: 30,
        color: '#C1FF1C'
    },
    image: {
        height: 97,
        width: 61,
        marginLeft: 17
    },
    image2: {
        height: 100,
        width: 66,
        marginRight: 20
    },
    cardparagrap2: {
        fontSize: 30,
        color: '#C1FF1C',
        marginRight: 20
    },
    tips: {
        marginTop: 4
    },
    signout: {
        flexDirection: 'row',
        marginTop: 30
    },
    signouttext: {
        color: 'white',
        marginLeft: 10,
        fontSize: 19,
        marginRight: 10,
        marginTop: 6
    },
    button: {
        backgroundColor: '#C1FF1C',
        borderRadius: 20,
        width: 100,
        height: 40,
        alignItems: 'center',
    },
    buttontext: {
        fontSize: 19,
        fontWeight: '600',
        marginTop: 6,
        color: '#343436'
    }
});