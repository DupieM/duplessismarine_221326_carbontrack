import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  LandingScreen({}){
    return (
        <View style={styles.container}>
            <Text>Landing</Text>
        </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
      alignItems: 'center',
      justifyContent: 'center',
    },
});