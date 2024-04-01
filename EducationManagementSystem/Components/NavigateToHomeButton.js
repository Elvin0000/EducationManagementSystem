import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavigateToHomeButton = () => {
  const navigation = useNavigation();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={navigateToHome}>
      <Text style={styles.buttonText}>Done</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4494ad',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width:100,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default NavigateToHomeButton;
