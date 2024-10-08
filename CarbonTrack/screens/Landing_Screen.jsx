import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'

function  LandingScreen({ navigation }){
    return (
        <ScrollView style={styles.container}>
            <View style={styles.container2}>
                <View style={styles.head}>
                    <Text style={styles.mainhead}>Know your</Text>
                    <Text style={styles.mainhead2}>impact</Text>
                </View>
                <View>
                    <Text style={styles.graph}>Graph</Text>
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
    }
});