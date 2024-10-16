import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { createNewEntry } from '../services/DbService';

const cardData = [
  { id: 1, label: 'Swipe left to continue ' },
];

function TrackerScreen() {
  return (
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
        <SwipeableCard key={card.id} label={card.label} />
      ))}
    </GestureHandlerRootView>
  );
}

const SwipeableCard = ({ label }) => {
  const translateX = useSharedValue(0);
  const [showForm, setShowForm] = useState(false);

  //data for form
  const [householdOccupants, setHouseholdOccupants] = useState('');
  const [transportUsed, setTransportUsed] = useState('');
  const [kilometersTraveled, setKilometersTraveled] = useState('');
  const [flightsPerYear, setFlightsPerYear] = useState('');
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
      householdOccupants,
      transportUsed,
      kilometersTraveled,
      flightsPerYear,
      energyType,
      dietPreferences,
      recycle
    };

    // Assuming you have a uid (user ID)
    const uid = "some-unique-user-id"; // Replace with actual user ID
    await createNewEntry(formData, uid);
    console.log("Form data submitted:", formData);
  };

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
          <Text style={styles.cardText}>Type of Transport used</Text>
          <TextInput style={styles.input} 
          placeholder="Enter Transport Name" 
          placeholderTextColor="white"
          Value={transportUsed}
          onChangeText={newText => setTransportUsed(newText)}
          />
          <Text style={styles.cardText}>Kilometers traveled per year</Text>
          <TextInput style={styles.input} 
          placeholder="Enter number" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={kilometersTraveled}
          onChangeText={newText => setKilometersTraveled(newText)}
          />
          <Text style={styles.cardText}>Number of times you fly per year</Text>
          <TextInput style={styles.input} 
          placeholder="Enter number" 
          keyboardType="numeric" 
          placeholderTextColor="white"
          Value={flightsPerYear}
          onChangeText={newText => setFlightsPerYear(newText)}
          />

          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </PanGestureHandler>

      {showForm && (
        <Animated.View style={[styles.formContainer, animatedFormStyle]}>
            <Text style={styles.cardText}>Type of energy used</Text>
            <TextInput style={styles.input} 
            placeholder="Enter type" 
            placeholderTextColor="white"
            Value={energyType}
            onChangeText={newText => setEnergyType(newText)}
            />
            <Text style={styles.cardText}>Diet preferences</Text>
            <TextInput style={styles.input} 
            placeholder="Enter Diet Plan" 
            placeholderTextColor="white"
            Value={dietPreferences}
            onChangeText={newText => setDietPreferences(newText)}
            />
            <Text style={styles.cardText}>Do you recycle</Text>
            <TextInput style={styles.input} 
            placeholder="Enter yes/no" 
            placeholderTextColor="white"
            Value={recycle}
            onChangeText={newText => setRecycle(newText)}
            />
            <Button title="Calculate"
              onPress={handleSubmit}  />
        </Animated.View>
      )}
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
    // swipeableContainer: {
    //   flexDirection: 'row',
    //   display: 'flex'
    // },
    card: {
      backgroundColor: '#55A545',
      padding: 13,
      borderRadius: 10,
      marginTop: 20,
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
  });
