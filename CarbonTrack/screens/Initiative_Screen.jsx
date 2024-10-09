import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'

function  InitiativeScreen({}){
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.mainhead}>Local Initiatives</Text>
            </View>
            <TouchableOpacity style={styles.cardone}>
                <Image />
                <Text style={styles.cardparagrap}>Name</Text>
                <Text style={styles.cardparagrap}>Description</Text>
                <Text style={styles.cardparagrap}>Location</Text>
            </TouchableOpacity>
        </View>
    )
}

export default InitiativeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007541',
        alignItems: 'center',
      },
      head: {
          alignItems: 'center',
          marginTop: 30
      },
      mainhead: {
          fontSize: 43,
          fontWeight: '500',
          color: 'white'
      },
      mainhead2: {
          marginTop: -10,
          fontSize: 43,
          fontWeight: '500',
          color: 'white'
      },
      cardone: {
          backgroundColor: '#3AA345',
          marginRight: 27,
          borderRadius: 10,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 15,
          paddingRight: 15,
          marginLeft: 27,
          marginTop: 25,
          width: 300
      },
      cardparagrap: {
          fontSize: 30,
          color: '#C1FF1C'
      },
});