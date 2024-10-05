import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  TrackerScreen({}){
    return (
        <View style={styles.container}>
            <Text>Tracker</Text>
        </View>
    )
}

export default TrackerScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});