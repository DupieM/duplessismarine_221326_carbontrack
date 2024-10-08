import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LogInScreen from './screens/LogIn_Screen';
import SignUpScreen from './screens/SignUp_Screen';
import LandingScreen from './screens/Landing_Screen';
import TrackerScreen from './screens/Tracker_Screen';
import ReduceScreen from './screens/Reduce_Screen';
import InitiativeScreen from './screens/Initiative_Screen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import ResultScreen from './screens/Result-Screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      
      {/* TrackerScreen will be part of the stack but won't show in bottom navigation */}
      <Stack.Screen 
        name="Tracker" 
        component={TrackerScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
      <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
          backgroundColor: '#303031',
          height: 55,
          borderTopWidth: 0,
          padding: 3,
          paddingBottom: 3
        }})}>
          <Tab.Screen name="Home" component={MainStackNavigator}
            options={{
              tabBarLabel: 'Home',
              tabBarActiveTintColor: '#58BB44',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({size,focused,color}) => {
                return (
                  <Image
                    style={{ width: size, height: size }}
                    source={
                      focused
                        ? require('./assets/Home_Active.png')
                        : require('./assets/Home_Inactive.png')
                    }
                  />
                );
              },
            }}
          />
          <Tab.Screen name="Track" component={ResultScreen}
            options={{
              tabBarLabel: 'Track',
              tabBarActiveTintColor: '#58BB44',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({size,focused,color}) => {
                return (
                  <Image
                    style={{ width: size, height: size }}
                    source={
                      focused
                        ? require('./assets/Track_Active.png')
                        : require('./assets/Track_Inactive.png')
                    }
                  />
                );
              },
            }}
          />
          <Tab.Screen name="Reduce" component={ReduceScreen}
            options={{
              tabBarLabel: 'Reduce',
              tabBarActiveTintColor: '#58BB44',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({size,focused,color}) => {
                return (
                  <Image
                    style={{ width: size, height: size }}
                    source={
                      focused
                        ? require('./assets/Reduce_Active.png')
                        : require('./assets/Reduce_Inactive.png')
                    }
                  />
                );
              },
            }}
          />
          <Tab.Screen name="Initiative" component={InitiativeScreen}
            options={{
              tabBarLabel: 'Initiative',
              tabBarActiveTintColor: '#58BB44',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({size,focused,color}) => {
                return (
                  <Image
                    style={{ width: size, height: size }}
                    source={
                      focused
                        ? require('./assets/Initiative_Active.png')
                        : require('./assets/Initiative_Inactive.png')
                    }
                  />
                );
              },
            }}
          />
    </Tab.Navigator>
  );
}

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {

        setLoggedIn(true)
        console.log("User logged in... " + user.email)

        } catch (error) {
          console.error("Error fetching user document: ", error);
        }
      } else {
        setLoggedIn(false)
        console.log("No user logged in...")
      }
    })

    return unsubscribe
  }, [])

  return (
    <>
      { loggedIn ? (
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LogInScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
