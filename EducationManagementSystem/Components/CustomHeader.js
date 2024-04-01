import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{route.name}</Text>
      <TouchableOpacity onPress={navigateToHome}>
        <Text style={styles.homeButton}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontFamily: 'Marker Felt', 
    color: '#4494ad',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    fontFamily: 'Marker Felt', // Add your custom font here
    color: '#4494ad',
    fontSize: 16,
  },
});

export default CustomHeader;
