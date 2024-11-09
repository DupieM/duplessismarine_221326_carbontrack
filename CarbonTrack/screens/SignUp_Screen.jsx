import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { handleSignin } from '../services/authService';

function  SignUpScreen({}){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');

    //Sign up Function
    const handleCreation = async () => {
        // Validate all required fields are filled
        if (!username.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Validation Error", "Please fill all the required fields.");
            return;
        }
    
        // Check password length
        if (password.length < 6) {
            Alert.alert("Validation Error", "Password is too short. It must be at least 6 characters.");
            return;
        }
    
        // Send information to Firestore to create a user
        var infos = { username, email, password };
        var success = await handleSignin(email, password, infos);
    
        // Check success of the sign-up process
        if (success) {
            Alert.alert("Sign Up", "You have successfully signed into carbonTrack.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={require('../assets/SignUp.png')} style={styles.img}>
                <View>
                    <Text style={styles.mainhead}>Sign Up</Text>
                    <View>
                        <TextInput style={styles.input} placeholder='Username'
                        onChangeText={newText => setUserName(newText)}
                        defaultValue={username}
                        />
                    </View>
                    <View>
                        <TextInput style={styles.input} placeholder='Email'
                        onChangeText={newText => setEmail(newText)}
                        defaultValue={email}
                        />
                    </View>
                    <View>
                        <TextInput style={styles.input} placeholder='Password'
                        onChangeText={newText => setPassword(newText)}
                        defaultValue={password}
                        secureTextEntry={true}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.Btn} onPress={handleCreation}>
                            <Text style={styles.Btntext}>Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            
        </ScrollView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007541',
    },
    img: {
          height: 732,
          flex: 1,
          paddingTop: 20,
    },
    card: {
        marginTop: 242,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        height: 470
    },
    mainhead: {
        marginTop: 190,
        fontSize: 75,
        textAlign: 'center',
        color: 'white',
        fontWeight: '200',
        fontFamily: 'PatrickHand'
    },
    input: {
        backgroundColor: '#B1E7A7',
        height: 60,
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 10,
        marginLeft: 35,
        borderRadius: 30,
        width: '80%',
        color: '#00272E',
        marginTop: 23,
        fontFamily: 'NunitoMedium',
        fontWeight: '200'
    },
    password: {
        marginLeft: 50,
        marginTop: 5,
        marginBottom: 27,
        fontSize: 15,
        color: '#9BE931',
        fontFamily: 'NunitoItalic'
    },
    Btn: {
        backgroundColor: '#58BB44',
        width: 200,
        marginLeft: 85,
        padding: 6,
        borderRadius: 50,
        marginBottom: 25,
        marginTop: 30
    },
    Btntext: {
        fontSize: 33,
        fontWeight: '200',
        textAlign: 'center',
        color: '#303031',
        fontFamily: 'NunitoBlack'
    },
})