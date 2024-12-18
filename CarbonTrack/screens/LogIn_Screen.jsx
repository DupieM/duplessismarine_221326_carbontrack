import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native'
import { googlesignin, handleLogin, resetPassword } from '../services/authService';

function  LogInScreen({ navigation }){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    // Login Function
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        // Check if all required fields are filled
        if (email.trim() && password.trim()) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [email, password]);

    const login = async () => {
        if (!isFormValid) {
            Alert.alert("Validation Error", "Please fill all the required fields.");
            return;
        }
    
        try {
            const success = await handleLogin(email, password);
    
            if (success) {
                Alert.alert("Log In", "You have successfully logged into CarbonTrack.");
            }
        } catch (error) {
            console.log("Login Error:", error.code, error.message); // Check the exact error code and message
            if (error.code === 'auth/invalid-email') {
                Alert.alert("Invalid Email", "Please enter a valid email address.");
            } else if (error.code === 'auth/user-not-found') {
                Alert.alert("User Not Found", "No account found with this email.");
            } else if (error.code === 'auth/wrong-password') {
                Alert.alert("Wrong Password", "The password you entered is incorrect.");
            } else {
                Alert.alert("Login Failed", "An unknown error occurred. Please try again.");
            }
        }
    };

    // Handle password reset
    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Forgot Password", "Please enter your email address first.");
            return;
        }
        
        try {
            await resetPassword(email);
            Alert.alert("Password Reset", "A password reset email has been sent.");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={require('../assets/Login.png')} style={styles.img}>
                <View>
                    <Text style={styles.mainhead}>Log In</Text>
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
                        <Text style={styles.password} onPress={handleForgotPassword}>
                            Forgot Password?
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.Btn} onPress={login}>
                            <Text style={styles.Btntext}>Proceed</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ImageBackground>
        </ScrollView>
        
    )
}

export default LogInScreen

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
        marginTop: 293,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        height: 420
    },
    mainhead: {
        marginTop: 100,
        fontSize: 75,
        textAlign: 'center',
        color: 'white',
        fontWeight: '300',
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
        fontSize: 18,
        color: '#9BE931',
        fontFamily: 'NunitoItalic'
    },
    Btn: {
        backgroundColor: '#58BB44',
        width: 200,
        marginLeft: 85,
        padding: 6,
        borderRadius: 50,
        marginBottom: 25
    },
    Btntext: {
        fontSize: 33,
        fontWeight: '200',
        textAlign: 'center',
        color: '#303031',
        fontFamily: 'NunitoBlack'
    },
    signupcontainer: {
        flexDirection: 'row',
        marginLeft: 77
    },
    signup: {
        textAlign: 'center',
        color: '#343436'
    },
})