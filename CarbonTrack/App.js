import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)


  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
    //     <Stack.Screen name="Login" component={LogInScreen}/>
    //     <Stack.Screen name="SignUp" component={SignUpScreen}/>
    //   </Stack.Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
        backgroundColor: '#303031',
        height: 55,
        borderTopWidth: 0,
        padding: 3,
        paddingBottom: 3
      }})}>
        <Tab.Screen name="Home" component={LandingScreen}
          options={{
            tabBarLabel: 'Home',

          }}
        />
        <Tab.Screen name="Track" component={TrackerScreen}
          options={{
            tabBarLabel: 'Track',
            
          }}
        />
        <Tab.Screen name="Reduce" component={ReduceScreen}
          options={{
            tabBarLabel: 'Reduce',
            
          }}
        />
        <Tab.Screen name="Initiative" component={InitiativeScreen}
          options={{
            tabBarLabel: 'Initiative',
            
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>

    // <>
    //   { loggedIn ? (
    //     <NavigationContainer>
    //       <Tab.Navigator screenOptions={{headerShown: false}}>
    //         <Tab.Screen name="Home" component={LandingScreen}/>
    //         <Tab.Screen name="Track" component={TrackerScreen}/>
    //         <Tab.Screen name="Reduce" component={ReduceScreen}/>
    //         <Tab.Screen name="Initiative" component={InitiativeScreen}/>
    //       </Tab.Navigator>
    //     </NavigationContainer>
    //   ) : (
    //     <NavigationContainer>
    //       <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
    //         <Stack.Screen name="Login" component={LogInScreen}/>
    //         <Stack.Screen name="SignUp" component={SignUpScreen}/>
    //       </Stack.Navigator>
    //     </NavigationContainer>
    //   )}
    // </>
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
