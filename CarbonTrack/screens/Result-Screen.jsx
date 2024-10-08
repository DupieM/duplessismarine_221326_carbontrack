import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, } from 'react-native'

function  ResultScreen({ navigation }){
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Your Carbon</Text>
                <Text style={styles.mainhead2}>Footprint is</Text>
            </View>
            <View>
                <Text style={styles.graph}>Graph</Text>
            </View>
            <View>
                <Text style={styles.graph}>Graph & Legend</Text>
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