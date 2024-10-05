import React from 'react'
import { View, Text, ScrollView, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native'


function  SignUpScreen({}){


    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={require('../assets/Auth_Picture_1.png')} style={styles.img}>
                <View style={styles.card}>
                    <Text style={styles.mainhead}>Sign Up</Text>
                    <View>
                        <TextInput style={styles.input} placeholder='Username'/>
                    </View>
                    <View>
                        <TextInput style={styles.input} placeholder='Email'/>
                    </View>
                    <View>
                        <TextInput style={styles.input} placeholder='Password'/>
                        <Text style={styles.password}>Forgot Password?</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.Btn}>
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
        marginTop: 5,
        fontSize: 53,
        textAlign: 'center',
        color: '#343436',
        fontWeight: 'bold',
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
        marginTop: 23
    },
    password: {
        marginLeft: 50,
        marginTop: 5,
        marginBottom: 27,
        fontSize: 15,
        color: '#343436'
    },
    Btn: {
        backgroundColor: '#007541',
        width: 200,
        marginLeft: 85,
        padding: 6,
        borderRadius: 50,
        marginBottom: 25
    },
    Btntext: {
        fontSize: 33,
        fontWeight: '700',
        textAlign: 'center',
        color: '#9BE931'
    },
})