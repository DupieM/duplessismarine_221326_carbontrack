import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function  ReduceScreen({}){
    return (
        <View style={styles.container}>
            <Text>Reduce</Text>
        </View>
    )
}

export default ReduceScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});