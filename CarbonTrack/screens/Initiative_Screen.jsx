import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  InitiativeScreen({}){
    return (
        <View style={styles.container}>
            <Text>Reduce</Text>
        </View>
    )
}

export default InitiativeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007541',
      alignItems: 'center',
      justifyContent: 'center',
    },
});