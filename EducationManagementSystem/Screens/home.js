import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const handleViewResult = () => {
    // Navigate to the AddResult screen
    navigation.navigate('AddResult');
  };

  return (
    <View>
      <Text>Welcome to the Home Screen</Text>

      {/* Add a button to navigate to AddResult screen */}
      <Button title="View Exam Result" onPress={handleViewResult} />
    </View>
  );
};

export default Home;