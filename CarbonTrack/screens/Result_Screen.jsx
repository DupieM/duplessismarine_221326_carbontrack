import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'

function  ResultScreen({ navigation, route }){

    const { carbonFootprint } = route.params;

    // Extract emissions data
    const { householdEmission, transportEmission, energyEmission, dietEmission } = carbonFootprint;

    // Extract emissions data and default to zero if undefined
    const emissionsData = [
        householdEmission || 0,
        transportEmission || 0,
        energyEmission || 0,
        dietEmission || 0,
    ];
    console.log("Emissions Data:", emissionsData);



    //Quickchart url
    const chartConfig = {
        type: 'polarArea',
        data: {
            labels: ['Home', 'Transportation', 'Energy', 'Diet'],
            datasets: [{
                data: emissionsData.map(value => value > 0 ? value : 0.1),
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
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Your Carbon</Text>
                <Text style={styles.mainhead2}>Footprint</Text>
            </View>
            <View>
                <Text style={styles.graph}>Graph</Text>
            </View>
            <View>
                <Image
                    style={styles.chartImage}
                    source={{ uri: chartUrl }}
                    resizeMode="contain"
                />
            </View>
            <TouchableOpacity style={styles.cardone} onPress={() => navigation.navigate('Reduce')}>
                <Text style={styles.cardparagrap2}>
                    Tips to reduce{"\n"}
                    footprint
                </Text>
                <Image style={styles.tips} source={require('../assets/Tips.png')}/>
            </TouchableOpacity>
        </View>
    )
}

export default ResultScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
      alignItems: 'center',
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
        marginLeft: 25,
        width: 400,
        height: 300,
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
    cardparagrap2: {
        fontSize: 30,
        color: '#C1FF1C',
        marginRight: 20
    },
    tips: {
        marginTop: 4
    }
});