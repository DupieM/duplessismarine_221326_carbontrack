import React from 'react'
import { ImageBackground, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image,  } from 'react-native'

function ChoosingScreen({ navigation }){
    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={require('../assets/Choosing.png')} style={styles.img}>
                <View>
                    <Image source={require('../assets/Icon.png')} style={styles.icon}/>
                    <Text style={styles.mainhead}>Carbon Track</Text>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.Btntext}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Btn} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.Btntext}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </ScrollView>
    )
}

export default ChoosingScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
    },
    img: {
        height: 732,
        flex: 1
    },
    icon: {
        height: 90,
        width: 90,
        marginLeft: 136,
        marginTop: 307
    },
    mainhead: {
        marginTop: 10,
        fontSize: 63,
        textAlign: 'center',
        color: 'white',
        fontWeight: '300',
        fontFamily: 'PatrickHand',
    },
    buttons: {
        marginTop: 35
    },
    Btn: {
        backgroundColor: '#58BB44',
        width: 200,
        marginLeft: 85,
        padding: 6,
        borderRadius: 50,
        marginBottom: 30
    },
    Btntext: {
        fontSize: 32,
        fontWeight: '500',
        textAlign: 'center',
        color: '#303031',
        fontFamily: 'NunitoBlack'
    },
})