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
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('Tracker')}>
                                <Image />
                                <Text>Track</Text>
                            </TouchableOpacity>
                            <Image />
                        </View>
                    </View>
                    <View>
                        <View>
                            <Image />
                            <TouchableOpacity onPress={() => navigation.navigate('Reduce')}>
                                <Image />
                                <Text>Reduce</Text>
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
        alignItems: 'center',
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
        color: '#438EF3'
    },
    subhead: {
        fontSize: 35,
        color: 'white'
    }
});