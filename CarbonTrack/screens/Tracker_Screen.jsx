import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const cardData = [
  { id: 1, label: 'Swipe left to continue Card 1' },
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
      transform: [{ translateX: showForm ? 0 : -300 }], // Animation for the form card
    };
  });

  return (
    <View>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.cardText}>Swipe to fill out the rest of the form</Text>
        </Animated.View>
      </PanGestureHandler>

      {showForm && (
        <Animated.View style={[styles.formCard, animatedFormStyle]}>
          <Text style={styles.formLabel}>Additional Form Fields</Text>
          <TextInput style={styles.input} placeholder="Enter details" />
          <TextInput style={styles.input} placeholder="More information" />
          <Button title="Submit" onPress={() => console.log('Form submitted')} />
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
      marginTop: 20,
    },
    subText: {
      fontSize: 25,
      color: 'white',
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
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
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    cardText: {
      fontSize: 16,
    },
    formCard: {
      backgroundColor: '#fff',
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
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });
