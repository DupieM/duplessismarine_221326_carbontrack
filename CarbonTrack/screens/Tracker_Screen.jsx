import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Button, Modal } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { createNewEntry, saveCalculationAnswer } from '../services/DbService';
import { auth } from '../firebase';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native'; // Import this hook
import axios from 'axios';
import { calculateCarbonFootprint } from '../sub-services/calculation';

const cardData = [
  { id: 1, label: 'Swipe left to continue ' },
];

function TrackerScreen({ navigation }) {
  return (
    <ScrollView>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.mainhead}>Your Carbon</Text>
          <Text style={styles.mainhead2}>Footprint</Text>
        </View>
        <View style={styles.subhead}>
          <Text style={styles.subText}>Track your impact</Text>
          <Text style={styles.subText}>on the environment</Text>
        </View>

        {cardData.map((card) => (
          <SwipeableCard key={card.id} label={card.label} navigation={navigation}/>
        ))}
      </GestureHandlerRootView>
    </ScrollView>
  );
}

const SwipeableCard = ({ label }) => {
  const translateX = useSharedValue(0);
  const [showForm, setShowForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalEmissions, setTotalEmissions] = useState(null);
  const [carbonFootprintData, setCarbonFootprintData] = useState(null);
  const navigation = useNavigation();

  //data for form
  const [householdOccupants, setHouseholdOccupants] = useState('');
  const [transportUsed, setTransportUsed] = useState('');
  const [kilometersTraveled, setKilometersTraveled] = useState('');
  const [watts, setWatts] = useState('');
  const [energyType, setEnergyType] = useState('');
  const [dietPreferences, setDietPreferences] = useState('');
  const [recycle, setRecycle] = useState('');

  const handleGesture = (event) => {
    if (event.nativeEvent.translationX < -50) {
      // Swipe left action
      translateX.value = withSpring(-300); // Move card left
      setShowForm(true); // Show form on swipe
    } else if (event.nativeEvent.translationX > 50) {
      // Swipe right action
      translateX.value = withSpring(0); // Reset card to original position
      setShowForm(false); // Hide form when reset
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedFormStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: showForm ? -300 : 0 }],
    };
  });

  //to create enrty in database
  const handleSubmit = async () => {
    const formData = {
      householdOccupants: parseInt(householdOccupants), 
      transportUsed: parseFloat(transportUsed),
      kilometersTraveled: parseFloat(kilometersTraveled),
      watts: parseInt(watts),
      energyType: parseFloat(energyType),
      dietPreferences: parseFloat(dietPreferences),
      recycle,
      timestamp: new Date().toISOString()
    };

    try {
      const carbonFootprint = calculateCarbonFootprint(formData);

      setTotalEmissions(carbonFootprint.totalEmission); // Set total emissions
      setModalVisible(true); // Show modal

      // Store the carbonFootprint data for use after closing the pop-up
      setCarbonFootprintData(carbonFootprint);
  
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const carbonFootprintId = await createNewEntry(formData, uid);
  
        // Check that we have a valid ID before proceeding
        if (carbonFootprintId) {
          await saveCalculationAnswer(uid, carbonFootprintId, { 
            result: carbonFootprint, 
            timestamp: new Date().toISOString() 
          });
          console.log('Form data and calculation answer submitted:', formData);
  
        } else {
          console.error('Failed to get carbonFootprint ID');
        }
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error calculating or saving carbon footprint:', error);
    }

  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Result', { carbonFootprint: carbonFootprintData }); // Navigate to Result screen after closing modal
  };

  //Dropdown box for transposrtation
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { label: 'Petrol', value: 100 },
    { label: 'Diesel', value: 164 },
    { label: 'Electric', value: 35.1 },
    { label: 'Hybrid', value: 126.2 }
  ]

  //Dropdown box for energy used
  const [valuetwo, setValueTwo] = useState(null);
  const [isFocustwo, setIsFocusTwo] = useState(false);

  const data_two = [
    { label: 'Coal', value: 0.001 },
    { label: 'Petroleum', value: 0.00096 },
    { label: 'Natural Gas', value: 0.0004 },
    { label: 'Solar', value: 0.000019 }
  ]

  //Dropdown box for diet
  const [valuethree, setValueThree] = useState(null);
  const [isFocusthree, setIsFocusThree] = useState(false);

  const data_three = [
    { label: 'Meat lover', value: 1.3 },
    { label: 'Omnivore', value: 1.00 },
    { label: 'No Beef', value: 0.79 },
    { label: 'Vegatarian', value: 0.66 },
    { label: 'vegan', value: 0.56 }
  ]

  //Dropdown box for recycle
  const [valuefour, setValueFour] = useState(null);
  const [isFocusfour, setIsFocusFour] = useState(false);

  const data_four = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ]

  return (
    <View style={styles.swipeableContainer}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Text style={styles.cardText}>Household Occupants</Text>
          <TextInput style={styles.input} 
          placeholder="Enter number" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={householdOccupants}
          onChangeText={newText => setHouseholdOccupants(newText)}
          />
          <View>
            <Text style={styles.cardText}>Type of Transport used</Text>
            <Dropdown
              style={[styles.input]}
              placeholderStyle={styles.placeholderStyle}
              data={data}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Transportation Type'
              placeholderTextColor="white"
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
                setTransportUsed(item.value);
              }}
            />
          </View>
          <Text style={styles.cardText}>Kilometers traveled per year</Text>
          <TextInput style={styles.input} 
          placeholder="Enter number" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={kilometersTraveled}
          onChangeText={newText => setKilometersTraveled(newText)}
          />
          <Text style={styles.cardText}>How much kWh do you use</Text>
          <TextInput style={styles.input} 
          placeholder="Enter number" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={watts}
          onChangeText={newText => setWatts(newText)}
          />

          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </PanGestureHandler>

      {showForm && (
        <Animated.View style={[styles.formContainer, animatedFormStyle]}>
          <View>
            <Text style={styles.cardText}>Type of energy used</Text>
            <Dropdown
              style={[styles.input]}
              placeholderStyle={styles.placeholderStyle}
              data={data_two}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Transportation Type'
              placeholderTextColor="white"
              value={valuetwo}
              onFocus={() => setIsFocusTwo(true)}
              onBlur={() => setIsFocusTwo(false)}
              onChange={item => {
                setValueTwo(item.value);
                setIsFocusTwo(false);
                setEnergyType(item.value);
              }}
            />
          </View> 
          <View>
            <Text style={styles.cardText}>Diet preferences</Text>
            <Dropdown
              style={[styles.input]}
              placeholderStyle={styles.placeholderStyle}
              data={data_three}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Transportation Type'
              placeholderTextColor="white"
              value={valuethree}
              onFocus={() => setIsFocusThree(true)}
              onBlur={() => setIsFocusThree(false)}
              onChange={item => {
                setValueThree(item.value);
                setIsFocusThree(false);
                setDietPreferences(item.value);
              }}
            />
          </View>
          <View>
            <Text style={styles.cardText}>Do you recycle</Text>
            <Dropdown
              style={[styles.input]}
              placeholderStyle={styles.placeholderStyle}
              data={data_four}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Transportation Type'
              placeholderTextColor="white"
              value={valuefour}
              onFocus={() => setIsFocusFour(true)}
              onBlur={() => setIsFocusFour(false)}
              onChange={item => {
                setValueFour(item.value);
                setIsFocusFour(false);
                setRecycle(item.value);
              }}
            />
          </View>
          <Button title="Calculate"
              onPress={handleSubmit}  />
        </Animated.View>
      )}

      {/* Modal for displaying total emissions */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Total Emissions</Text>
            <Text style={styles.modalText}>{totalEmissions} ton CO2</Text>
            <Button title="Close" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default TrackerScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
      alignItems: 'center',
    },
    head: {
      alignItems: 'center',
      marginTop: 30,
    },
    mainhead: {
      fontSize: 50,
      fontWeight: '700',
      color: 'white',
    },
    mainhead2: {
      marginTop: -10,
      fontSize: 50,
      fontWeight: '700',
      color: 'white',
    },
    subhead: {
      alignItems: 'center',
      marginTop: 10,
    },
    subText: {
      fontSize: 25,
      color: 'white',
    },
    swipeableContainer: {
      marginBottom: 40
    },
    card: {
      backgroundColor: '#55A545',
      padding: 13,
      borderRadius: 10,
      marginTop: 20,
      marginRight: 10,
      width: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    label: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      textAlign: "center",
      color: '#C1FF1C'
    },
    cardText: {
      fontSize: 20,
      color: '#343436',
      fontWeight: '500',
      marginBottom: 4
    },
    formContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      left: 310,
      width: 300,
      backgroundColor: '#55A545',
      padding: 20,
      borderRadius: 10,
      marginTop: 10,
    },
    formCard: {
      backgroundColor: '#55A545',
      padding: 20,
      borderRadius: 10,
      marginTop: 10, // Change marginTop to 10 for closer placement
      width: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    formLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      height: 40,
      border: 'none',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: '#007541',
      color: 'white'
    },
    placeholderStyle: {
      color: 'white'
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold' },
  modalText: { fontSize: 20, marginVertical: 10 },
  });
