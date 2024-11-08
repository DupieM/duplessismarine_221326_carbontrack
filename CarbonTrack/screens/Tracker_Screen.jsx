import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Button, Modal, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { createNewEntry, saveCalculationAnswer } from '../services/DbService';
import { auth } from '../firebase';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native'; // Import this hook
import axios from 'axios';
import { calculateCarbonFootprint } from '../sub-services/calculation';
import { Ionicons } from '@expo/vector-icons';

const cardData = [
  { id: 1, label: 'Swipe left to continue ' },
];

function TrackerScreen({ navigation }) {

  const [infoVisible, setInfoVisible] = useState(false);

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

        {/* Info icon with modal */}
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoIcon}>
          <Ionicons name="information-circle-outline" size={30} color="white" />
        </TouchableOpacity>

        {/* Modal for form instructions */}
        <Modal visible={infoVisible} transparent={true} animationType="slide">
          <View style={styles.modalBackground_two}>
            <View style={styles.modalContainer_two}>
              <Text style={styles.modalTitle_two}>How to Fill Out the Form</Text>
              <Text style={styles.modelSubhead_two}>To calculate your carbon footprint you need to supply us with the following information.</Text>
              <Text style={styles.modalText_two}>1. Enter the number of people living in your household.</Text>
              <Text style={styles.modalText_two}>2. Select the type of transport you most frequently use.</Text>
              <Text style={styles.modalText_two}>3. Input the kilometers you travel per year per road.</Text>
              <Text style={styles.modalText_two}>4. Specify your annual kWh energy consumption in your household.</Text>
              <Text style={styles.modalText_two}>5. Choose your primary diet preference.</Text>
              <Text style={styles.modalText_two}>6. Indicate if you recycle or not.</Text>
              <TouchableOpacity style={styles.Btn_three} onPress={() => setInfoVisible(false)}>
                <Text style={styles.Btn_three_text}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {cardData.map((card) => (
          <SwipeableCard key={card.id} label={card.label} navigation={navigation}/>
        ))}
      </GestureHandlerRootView>
    </ScrollView>
  );
}

// Fuction to activate swipeable card to see the other half of the form
const SwipeableCard = ({ label }) => {
  // Code to get the model to work
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

  // Gesture to hadle swipe of card
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

  // Code to activate the animated card style
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

    // Proceed with form submission and navigation to ResultScreen
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

  // function to close model and navigate to the reslut screen
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
    { label: 'Vegan', value: 0.56 }
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
          placeholder="Enter number of people" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={householdOccupants}
          onChangeText={newText => setHouseholdOccupants(newText)}
          />
          <View>
            <Text style={styles.cardText}>Type of Transport used</Text>
            <Dropdown
              style={[
                styles.input,
                isFocus ? styles.dropdownActive : null,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
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
              containerStyle={styles.dropdownContainer} // style for dropdown options container
              itemStyle={styles.itemStyle} // style for individual dropdown items
              selectedItemStyle={styles.selectedItemStyle} // style for selected dropdown item
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
              style={[
                styles.input,
                isFocus ? styles.dropdownActive : null,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data_two}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Energy Type'
              placeholderTextColor="white"
              value={valuetwo}
              onFocus={() => setIsFocusTwo(true)}
              onBlur={() => setIsFocusTwo(false)}
              onChange={item => {
                setValueTwo(item.value);
                setIsFocusTwo(false);
                setEnergyType(item.value);
              }}
              containerStyle={styles.dropdownContainer} // style for dropdown options container
              itemStyle={styles.itemStyle} // style for individual dropdown items
              selectedItemStyle={styles.selectedItemStyle} // style for selected dropdown item
            />
          </View> 
          <View>
            <Text style={styles.cardText}>Diet preferences</Text>
            <Dropdown
              style={[
                styles.input,
                isFocus ? styles.dropdownActive : null,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data_three}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Diet Preference'
              placeholderTextColor="white"
              value={valuethree}
              onFocus={() => setIsFocusThree(true)}
              onBlur={() => setIsFocusThree(false)}
              onChange={item => {
                setValueThree(item.value);
                setIsFocusThree(false);
                setDietPreferences(item.value);
              }}
              containerStyle={styles.dropdownContainer} // style for dropdown options container
              itemStyle={styles.itemStyle} // style for individual dropdown items
              selectedItemStyle={styles.selectedItemStyle} // style for selected dropdown item
            />
          </View>
          <View>
            <Text style={styles.cardText}>Do you recycle</Text>
            <Dropdown
              style={[
                styles.input,
                isFocus ? styles.dropdownActive : null,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data_four}
              maxHeight={300}
              fontSize={50}
              labelField="label"
              valueField="value"
              placeholder='Choose Yes/No'
              placeholderTextColor="white"
              value={valuefour}
              onFocus={() => setIsFocusFour(true)}
              onBlur={() => setIsFocusFour(false)}
              onChange={item => {
                setValueFour(item.value);
                setIsFocusFour(false);
                setRecycle(item.value);
              }}
              containerStyle={styles.dropdownContainer} // style for dropdown options container
              itemStyle={styles.itemStyle} // style for individual dropdown items
              selectedItemStyle={styles.selectedItemStyle} // style for selected dropdown item
            />
          </View>
          <TouchableOpacity  style={styles.Btn} onPress={handleSubmit}>
            <Text style={styles.Btntext}>Calculate</Text>
          </TouchableOpacity>

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
            <Text style={styles.modalText}>{totalEmissions} ton CO₂</Text>
            <TouchableOpacity style={styles.Btn_two} onPress={handleCloseModal} >
              <Text style={styles.Btn_two_text}>Close</Text>
            </TouchableOpacity>
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
    fontSize: 64,
    fontWeight: '200',
    color: 'white',
    fontFamily: 'PatrickHand',
  },
  mainhead2: {
    marginTop: -16,
    fontSize: 64,
    fontWeight: '200',
    color: 'white',
    fontFamily: 'PatrickHand',
  },
  subhead: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  subText: {
    fontSize: 25,
    color: '#C1FF1C',
    fontFamily: 'NunitoMedium',
  },
  infoIcon: {
    position: 'absolute',
    top: 250,
    right: 30,
  },
  modalBackground_two: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer_two: {
    width: 340,
    padding: 20,
    backgroundColor: '#007541',
    borderRadius: 10,
    alignItems: 'left',
  },
  modalTitle_two: {
    fontSize: 33,
    fontWeight: '300',
    marginBottom: 0,
    fontFamily: 'NunitoBold',
    lineHeight: 37,
    textAlign: 'center',
    color: 'white'
  },
  modelSubhead_two: {
    marginTop: 4,
    marginBottom: 7,
    fontSize: 18,
    fontFamily: 'NunitoMedium',
    lineHeight: 20,
    color: 'white'
  },
  modalText_two: {
    fontSize: 21,
    marginBottom: 5,
    textAlign: 'left',
    fontFamily: 'Nunito',
    lineHeight: 23,
    fontWeight: '300',
    color: 'white'
  },
  Btn_three: {
    backgroundColor: '#58BB44',
    width: 140,
    padding: 3,
    marginTop: 10,
    borderRadius: 20,
    marginLeft: 80
  },
  Btn_three_text: {
    color: '#303031',
    fontFamily: 'NunitoBold',
    fontSize: 27,
    textAlign: 'center',
  },
  swipeableContainer: {
    marginBottom: 40,
    marginLeft: 13
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
    fontWeight: '200',
    marginBottom: 4,
    fontFamily: 'NunitoBold'
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
    color: 'white',
    fontFamily: 'NunitoMedium',
    fontSize: 16
  },
  placeholderStyle: {
    color: 'white'
  },
  selectedTextStyle: {
    color: 'white',
  },
  dropdownActive: {
    backgroundColor: '#00502D',
  },
  dropdownContainer: {
    backgroundColor: '#96D629',
    borderRadius: 8,
  },
  itemStyle: {
    padding: 10,
    backgroundColor: '#60B6FF', 
    color: 'black', 
  },
  selectedItemStyle: {
    backgroundColor: 'blue', 
    color: 'white', 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  modalContent: { 
    width: '80%', 
    padding: 20, 
    backgroundColor: '#303031', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: 35, 
    fontWeight: '400',
    color: '#C1FF1C',
    fontFamily: 'NunitoMedium',
  },
  modalText: { 
    fontSize: 30, 
    marginVertical: 10,
    color: '#C1FF1C',
    fontFamily: 'NunitoMedium',
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
  Btn: {
    backgroundColor: '#303031',
    width: 200,
    marginLeft: 31,
    padding: 6,
    borderRadius: 50,
    marginTop: 25
  },
  Btntext: {
      fontSize: 33,
      fontWeight: '200',
      textAlign: 'center',
      color: '#C1FF1C',
      fontFamily: 'NunitoBold'
  },
  });
