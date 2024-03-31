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
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    color: 'blue',
    fontSize: 16,
  },
});

export default CustomHeader;
