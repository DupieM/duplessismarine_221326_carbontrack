import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { handleSignOut } from '../services/authService'
import { getAnswers } from '../services/DbService'
import { auth, db } from '../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

function  LandingScreen({ navigation }){

    // Logout
    const handleSignout = () => {
        handleSignOut()
    }

    // All the useStates to set answers 
    const [averageEmission, setAverageEmission] = useState(0);
    const globalAverage = 4.7;
    const [carbonFootprintIds, setCarbonFootprintIds] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the Carbofootprint ID's to be able to get the average and then plot it on a graph 
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const carbonFootprintsRef = collection(db, 'users', uid, 'carbonFootprints');

        // Listen for real-time updates
        const unsubscribe = onSnapshot(carbonFootprintsRef, (snapshot) => {
            const ids = snapshot.docs.map((doc) => doc.id);
            setCarbonFootprintIds(ids);
        }, (error) => {
            console.error("Error fetching carbon footprint IDs:", error);
            setError("Error retrieving data.");
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);
    
    const fetchAnswers = async (ids) => {
        const uid = auth.currentUser?.uid;
        try {
            const retrievedAnswers = await getAnswers(uid, ids);
            setAnswers(retrievedAnswers || []);

            // Cache answers in AsyncStorage
            // await AsyncStorage.setItem('answers', JSON.stringify(retrievedAnswers || []));
        } catch (err) {
            setError("Error retrieving answers");
            console.error("Error retrieving answers:", err);
        }
    };
    
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
    
    useFocusEffect(
        useCallback(() => {
            const handleAverage = () => {
                if (answers.length > 0) {
                            const validEmissions = answers
                                .map(answer => parseFloat(answer.totalEmission)) // Ensure conversion to number
                                .filter(emission => !isNaN(emission) && emission > 0); // Filter valid numeric values
                
                            if (validEmissions.length > 0) {
                                const totalEmission = validEmissions.reduce((sum, emission) => sum + emission, 0);
                                const avgEmission = totalEmission / validEmissions.length;
                                setAverageEmission(avgEmission);
                                setAverageEmission(parseFloat(avgEmission.toFixed(1)));;
                            } else {
                                console.warn("No valid emissions found in answers.");
                                setAverageEmission(0);
                            }
                        } else {
                            setAverageEmission(0);
                        }
            };

            handleAverage();
        }, [answers])
    );

    // useEffect(() => {
    //     if (answers.length > 0) {
    //         const validEmissions = answers
    //             .map(answer => parseFloat(answer.totalEmission)) // Ensure conversion to number
    //             .filter(emission => !isNaN(emission) && emission > 0); // Filter valid numeric values

    //         if (validEmissions.length > 0) {
    //             const totalEmission = validEmissions.reduce((sum, emission) => sum + emission, 0);
    //             const avgEmission = totalEmission / validEmissions.length;
    //             setAverageEmission(avgEmission);
    //             setAverageEmission(parseFloat(avgEmission.toFixed(1)));;
    //         } else {
    //             console.warn("No valid emissions found in answers.");
    //             setAverageEmission(0);
    //         }
    //     } else {
    //         setAverageEmission(0);
    //     }
    // }, [answers]);
    
    // To show if theri is an error when loading the page
    // if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    // if (error) return <Text>Error: {error}</Text>;

    // Function to display the Doughnut chart
    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['Your AVG Footprint', 'Global AVG Footprint'],
            datasets: [{
                data: [averageEmission || 0, globalAverage],
                backgroundColor: ['#60B6FF', '#96D629']
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 20,
                    },
                    formatter: (value) => `${value} tons CO₂`
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 20,
                }
            },
        }
    };
    
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;


    return (
        <ScrollView style={styles.container}>
            <View style={styles.container2}>
                <View style={styles.head}>
                    <Text style={styles.mainhead}>Know Your</Text>
                    <Text style={styles.mainhead2}>impact</Text>
                </View>
                <View>
                    <Image style={styles.chartImage} source={{ uri: chartUrl }} resizeMode="contain" />
                    
                </View>
                {loading && <Text style={styles.loadingText}>Loading...</Text>}
                <View>
                    <Text style={styles.subhead}>Explore CarbonTrack</Text>
                    <View>
                        <View style={styles.box}>
                            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Tracker')}>
                                <Image source={require('../assets/Calculate.png')}/>
                                <Text style={styles.cardparagrap}>
                                    Footprint{"\n"}
                                    Tracker
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
                        <Text style={styles.signouttext}>We hope to see you again </Text>
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
        fontSize: 66,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
        letterSpacing: 2,
        marginBottom: 10
    },
    mainhead2: {
        marginTop: -45,
        fontSize: 66,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
        letterSpacing: 2,
        marginBottom: 15
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    chartImage: {
        marginLeft: 46,
        width: 260,
        height: 140,
        marginBottom: 7
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'NunitoMedium',
    },
    graph: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 34,
        color: '#438EF3',
        textAlign: 'center',
    },
    subhead: {
        fontSize: 43,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
        fontFamily: 'PatrickHand',
    },
    box: {
        flexDirection: 'row',
        marginTop: 14,
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
        marginLeft: 16,
        fontSize: 30,
        color: '#C1FF1C',
        fontFamily: 'NunitoMedium'
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
        marginRight: 20,
        fontFamily: 'NunitoMedium'
    },
    tips: {
        marginTop: 4
    },
    signout: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 0
    },
    signouttext: {
        color: 'white',
        marginLeft: 10,
        fontSize: 17,
        marginRight: 22,
        marginTop: 2,
        fontFamily: 'NunitoMedium'
    },
    button: {
        backgroundColor: '#C1FF1C',
        borderRadius: 20,
        width: 100,
        height: 30,
        alignItems: 'center',
    },
    buttontext: {
        fontSize: 19,
        fontWeight: '600',
        marginTop: 1,
        color: '#343436',
        fontFamily: 'NunitoBold'
    }
});