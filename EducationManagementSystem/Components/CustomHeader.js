import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import AntIcon from 'react-native-vector-icons/AntDesign';

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={navigation.goBack} color="#4494ad"/>
      <Text style={styles.title}>{route.name}</Text>
      <TouchableOpacity onPress={navigateToHome} style={styles.homeButton}>
        <AntIcon name="home" size={20} style={styles.icon} />
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
    fontFamily: 'IBMPlexSerif-Bold', 
    color: '#4494ad',
    fontSize: 18,
    // fontWeight: 'bold',
    marginLeft: 16,
  },
  homeButton: {
    marginRight: 16,
  },
  icon: {
    color: '#4494ad',
  },
});

export default CustomHeader;
