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
                        <View>
                            <Text style={styles.modalText_head}>{selectedInitiative.name}</Text>
                        </View>
                        <View style={styles.iconRow}>
                            <Icon name="phone" size={35} color="#60B6FF" style={styles.icon} />
                            <Text style={styles.modalText}>{selectedInitiative.phone_number}</Text>
                        </View>
                        <View style={styles.iconRow}>
                            <Icon name="envelope" size={35} color="#60B6FF" style={styles.icon} />
                            <Text style={styles.modalText}>{selectedInitiative.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.Btn_two} onPress={() => setModalVisible(false)}>
                            <Text style={styles.Btn_two_text}>Close</Text>
                        </TouchableOpacity>
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
        fontSize: 55,
        fontWeight: '200',
        color: 'white',
        fontFamily: 'PatrickHand',
        marginBottom: -15
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
        fontWeight: '300',
        fontFamily: 'NunitoMedium',
        marginBottom: 7
    },
    cardparagraptwo: {
        fontSize: 15,
        color: '#C1FF1C',
        width: 200,
        fontFamily: 'NunitoMedium',
        lineHeight: 17
    },
    cardparagrapthree: {
        fontSize: 13,
        color: '#C1FF1C',
        marginTop: 5,
        fontFamily: 'NunitoMedium',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(48,48,49,0.92)',
        padding: 7
    },
    modalText_head: {
        fontSize: 34,
        color: '#C1FF1C',
        marginBottom: 20,
        fontFamily: 'NunitoBlack',
        marginBottom: 40
    },
    modalText: {
        fontSize: 25,
        color: '#96D629',
        marginBottom: 20
    },
    iconRow: {
        flexDirection: 'row',
        marginBottom: 10
    },
    icon: {
        marginRight: 20,
    },
    Btn_two: {
        backgroundColor: '#58BB44',
        width: 120,
        padding: 6,
        marginTop: 20,
        borderRadius: 20
    },
    Btn_two_text: {
        color: '#303031',
        fontFamily: 'NunitoBold',
        fontSize: 25,
        textAlign: 'center',
    },
});