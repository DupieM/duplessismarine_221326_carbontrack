import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  InitiativeScreen({}){
    return (
        <View style={styles.container}>
            <Text>Initiative</Text>
        </View>
    )
}

export default InitiativeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});