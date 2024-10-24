import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Button } from 'react-native'
import { getMyIniatives } from '../services/DbService';

function  InitiativeScreen({}){

    const [initiative, setInitiative] = useState([]);

    // Fetch data when screen is focused
    const handleGettingOfData = async () => {
        var allData = await getMyIniatives()
        setInitiative(allData)
    }

    useEffect(() => { 
        handleGettingOfData()
    }, [])


    return (
        <ScrollView style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Initiatives</Text>
            </View>
            <View style={styles.card}>
                {
                    initiative != [] ? (
                        initiative.map((initiative, index) => (
                            <TouchableOpacity key={index} style={styles.cardone}>
                                <Image style={styles.img} source={{uri: initiative.picture}}/>
                                <View>
                                    <Text style={styles.cardparagrap}>{initiative.name}</Text>
                                    <Text style={styles.cardparagraptwo}>{initiative.description}</Text>
                                    <Text style={styles.cardparagrapthree}>{initiative.location}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No Items Found Yet</Text>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default InitiativeScreen

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
    card: {
        marginBottom: 25
    },
    cardone: {
        backgroundColor: '#3AA345',
        marginRight: 27,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 0,
        marginLeft: 19,
        marginTop: 25,
        flexDirection: 'row',
        width: 325
    },
    img: {
        height: 100,
        width: 100,
        marginRight: 10
    },
    cardparagrap: {
        fontSize: 22,
        color: '#C1FF1C',
        fontWeight: '500'
    },
    cardparagraptwo: {
        fontSize: 15,
        color: '#C1FF1C',
        width: 200
    },
    cardparagrapthree: {
        fontSize: 13,
        color: '#C1FF1C',
        marginTop: 10
    },
});