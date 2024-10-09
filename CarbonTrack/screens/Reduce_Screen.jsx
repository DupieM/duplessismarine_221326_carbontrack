import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'

function  ReduceScreen({}){
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Ways to reduce</Text>
                <Text style={styles.mainhead2}>Carbon Footprint</Text>
            </View>
            
            <TouchableOpacity style={styles.cardone}>
                <Text style={styles.cardparagrap}>
                    Article Name and/or Link
                </Text>
            </TouchableOpacity>
            
        </View>
    )
}

export default ReduceScreen

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
        fontSize: 43,
        fontWeight: '500',
        color: 'white'
    },
    mainhead2: {
        marginTop: -10,
        fontSize: 43,
        fontWeight: '500',
        color: 'white'
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
        marginTop: 25
    },
    cardparagrap: {
        fontSize: 30,
        color: '#C1FF1C'
    },
});