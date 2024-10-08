import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  ResultScreen({}){
    return (
        <View style={styles.container}>
            <Text>Result</Text>
        </View>
    )
}

export default ResultScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});