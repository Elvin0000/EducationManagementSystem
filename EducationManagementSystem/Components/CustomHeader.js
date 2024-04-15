import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={navigation.goBack} />
      <Text style={styles.title}>{route.name}</Text>
      <TouchableOpacity onPress={navigateToHome}>
        <Text style={styles.homeButton}>Home</Text>
      </TouchableOpacity>
    </Appbar.Header>
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
    marginLeft: 16,
  },
  homeButton: {
    fontFamily: 'Marker Felt', // Add your custom font here
    color: '#4494ad',
    fontSize: 16,
    marginRight: 16,
  },
});

export default CustomHeader;
