import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Button } from 'react-native'
import { getMyIniatives } from '../services/DbService';
import Icon from 'react-native-vector-icons/FontAwesome';

function  InitiativeScreen({}){

    const [initiative, setInitiative] = useState([]);
    const [selectedInitiative, setSelectedInitiative] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch data when screen is focused
    const handleGettingOfData = async () => {
        var allData = await getMyIniatives()
        setInitiative(allData)
    }

    useEffect(() => { 
        handleGettingOfData()
    }, [])

    // Function to handle showing the pop-up with details
    const handleShowDetails = (initiative) => {
        setSelectedInitiative(initiative);
        setModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Initiatives</Text>
            </View>
            <View style={styles.card}>
                {
                    initiative != [] ? (
                        initiative.map((initiative, index) => (
                            <TouchableOpacity key={index} style={styles.cardone} onPress={() => handleShowDetails(initiative)}>
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

            {/* Modal for displaying phone number and email */}
            {selectedInitiative && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                    <View style={styles.iconRow}>
                            <Icon name="phone" size={30} color="#C1FF1C" style={styles.icon} />
                            <Text style={styles.modalText}>{selectedInitiative.phone_number}</Text>
                        </View>
                        <View style={styles.iconRow}>
                            <Icon name="envelope" size={30} color="#C1FF1C" style={styles.icon} />
                            <Text style={styles.modalText}>{selectedInitiative.email}</Text>
                        </View>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
            )}

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
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(48,48,49,0.85)',
    },
    modalText: {
        fontSize: 20,
        color: '#C1FF1C',
        marginBottom: 20
    },
    iconRow: {
        flexDirection: 'row',
        marginBottom: 10
    },
    icon: {
        marginRight: 20
    }
});