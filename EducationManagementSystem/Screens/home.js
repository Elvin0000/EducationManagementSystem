import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const handleAddResult = () => {
    navigation.navigate('AddResult');
  };

  const handleStudentSearch = () => {
    navigation.navigate('SearchStudent');
  };

  const handleOnlineAcademicAssistant = () => {
    navigation.navigate('OnlineAcademicAssistant');
  };

  const handleApproveStudent = () => {
    navigation.navigate('ApproveStudent');
  };

  const handleApproveTeacher = () => {
    navigation.navigate('ApproveTeacher');
  };

  const handleGenerateReport = () => {
    navigation.navigate('GenerateReport');
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>

      {/* Buttons to navigate to different screens */}
      <Button title="Add Exam Result" onPress={handleAddResult} />
      <Button title="StudentSearch" onPress={handleStudentSearch} />
      <Button title="Online Academic Assistant" onPress={handleOnlineAcademicAssistant} />
      <Button title="Approve Student" onPress={handleApproveStudent} />
      <Button title="Approve Teacher" onPress={handleApproveTeacher} />
      <Button title="Generate Report" onPress={handleGenerateReport} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home;